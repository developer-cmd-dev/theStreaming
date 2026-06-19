"use client"
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRef } from "react";

export default function Page() {

  const locationVideoRef = useRef<HTMLVideoElement | null>(null);

  const recieverVideoRef= useRef<HTMLVideoElement|null>(null);

  async function goLive() {


    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      const pc = new RTCPeerConnection();

      pc.oniceconnectionstatechange = () => {
        console.log("ICE:", pc.iceConnectionState);
      };
      
      pc.onconnectionstatechange = () => {
        console.log("Connection:", pc.connectionState);
      };


      stream.getTracks().forEach(tracks => {
        pc.addTrack(tracks, stream)
      })

      if (locationVideoRef.current) {
        locationVideoRef.current.srcObject = stream;
        await locationVideoRef.current.play();
      }

      const offer = await pc.createOffer();

      pc.setLocalDescription(offer)

      const response = await axios.post("http://localhost:8080/api/v1/signaling/offer", {
        sdp: offer.sdp,
        type: offer.type,
      });

    
      await pc.setRemoteDescription({
        type:'answer',
        sdp:response.data
      })


    } catch (error) {
      console.log(error)
    }



  }


  async function joinLive() {

    try {
      
    const pc = new RTCPeerConnection();

    pc.addTransceiver("video", { direction: "recvonly" });
pc.addTransceiver("audio", { direction: "recvonly" });
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer)




    const response = await axios.post("http://localhost:8080/api/v1/stream-join/offer", {
      sdp: offer.sdp,
      type: offer.type,
    });

    console.log(response.data)

    pc.setRemoteDescription({
      type:"answer",
      sdp:response.data
    });

    pc.ontrack = async(event)=>{
      const stream = event.streams[0];

      if(recieverVideoRef.current){
        recieverVideoRef.current.srcObject=stream ?? null;
         await recieverVideoRef.current.play()
      }
    }
    } catch (error) {
      console.log(error)
    }
    
  }



  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Button size="lg" onClick={goLive}>
        Go live
      </Button>

      <video
        ref={locationVideoRef}
        autoPlay
        playsInline
        muted
        className="w-1/2 h-1/2"
      />

<Button size="lg" onClick={joinLive}>
        join live
      </Button>

<video
        ref={recieverVideoRef}
        autoPlay
        playsInline
        muted
        className="w-1/2 h-1/2"
      />
    </div>
  );
}
