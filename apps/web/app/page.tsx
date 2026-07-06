"use client"
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
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

      const response = await axios.post("http://localhost:8080/api/v1/connect-media-server", 
       {
        sdp:offer.sdp,
        streamId:4545
       }
        ,
      {
        headers:{
          "Authorization":`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhN2U2ODY4ZS05OTlhLTRjNDctYjNkYy1hMmI1OTZiMmM2NTgiLCJ1c2VybmFtZSI6ImphbmVfZG9lIiwiaWF0IjoxNzgzMzU5Njc2LCJleHAiOjE3ODMzNzA0NzZ9.qwOmglxoffrTfrKG-Ihia_Vi2vmfjqWwNjHgpNqwkYQ`
        }
      }
      );

    
      await pc.setRemoteDescription({
        type:'answer',
        sdp:response.data
      })


    } catch (error) {
     if(error instanceof AxiosError){
      console.log(error.response?.data)
     }
    }



  }


  async function joinLive() {

    try {
      
    const pc = new RTCPeerConnection();

    pc.addTransceiver("video", { direction: "recvonly" });
pc.addTransceiver("audio", { direction: "recvonly" });
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer)




    const response = await axios.post(
      "http://localhost:8889/live/my-stream/whep",
      offer.sdp,
      {
        headers: {
          "Content-Type": "application/sdp",
        },
      }
    );
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
