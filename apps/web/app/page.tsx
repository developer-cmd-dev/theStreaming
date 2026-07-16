"use client"
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import { useRef } from "react";
import { type HttpResponse } from '../node_modules/@repo/zod/index'
export default function Page() {

  const locationVideoRef = useRef<HTMLVideoElement | null>(null);

  const recieverVideoRef = useRef<HTMLVideoElement | null>(null);

  const peerConnection = useRef<RTCPeerConnection|null> (null);
  const mediaStream = useRef<MediaStream|null>(null)


  async function goLive() {


    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if(!stream) mediaStream.current=stream;
      const pc = new RTCPeerConnection();
      stream.getTracks().forEach(tracks => {
        pc.addTrack(tracks, stream)
      })

      
      const videoTransceiver = pc
        .getTransceivers()
        .find((t) => t.sender.track?.kind === "video");

      const capabilities =
        RTCRtpSender.getCapabilities("video");

      const h264Codecs = capabilities?.codecs.filter(
        (codec) => codec.mimeType === "video/H264"
      );

      if (videoTransceiver && h264Codecs?.length) {
        videoTransceiver.setCodecPreferences(h264Codecs);
      }

      if (locationVideoRef.current) {
        locationVideoRef.current.srcObject = stream;
        await locationVideoRef.current.play();
      }

      const offer = await pc.createOffer();

      pc.setLocalDescription(offer)

      const response = await axios.post("http://localhost:3000/api/v1/connect-media-server",
        {
          sdp: offer.sdp,
          type: "offer",
          streamId: "c6c10609-0c33-4768-a589-0a9256a33daf"
        }
        ,
        {
          headers:{
            Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhN2U2ODY4ZS05OTlhLTRjNDctYjNkYy1hMmI1OTZiMmM2NTgiLCJ1c2VybmFtZSI6ImphbmVfZG9lIiwiaWF0IjoxNzg0MTI5ODY4LCJleHAiOjE3ODQxNDA2Njh9.dW2poWzJq8BDDRyjoDb8muIjiXD1CzNcCCV7Vxv_TL8"
          }
        }
      );

      const result = response.data as HttpResponse


      pc.oniceconnectionstatechange = () => {
        console.log("ICE:", pc.iceConnectionState);
      };

      pc.onconnectionstatechange = () => {
        console.log("Connection:", pc.connectionState);
      };

      await pc.setRemoteDescription({
        type: 'answer',
        sdp: result.data.sdpAnswer
      })

      peerConnection.current=pc;
      const recordingResponse = await axios.get("http://localhost:8080/api/v1/record-streaming/c6c10609-0c33-4768-a589-0a9256a33daf",)
      console.log(recordingResponse.data)
    } catch (error) {
      if (error instanceof AxiosError) {
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
        "http://localhost:8889/live/c6c10609-0c33-4768-a589-0a9256a33daf/whep",
        offer.sdp,
        {
          headers: {
            "Content-Type": "application/sdp",
          },
        }
      );

      pc.setRemoteDescription({
        type: "answer",
        sdp: response.data
      });

      pc.ontrack = async (event) => {
        const stream = event.streams[0];

        if (recieverVideoRef.current) {
          recieverVideoRef.current.srcObject = stream ?? null;
          await recieverVideoRef.current.play()
        }
      }
    } catch (error) {
      console.log(error)
    }

  }


  async function endStream() {
    const pc = peerConnection.current;
    console.log(pc)
    if(pc){
      axios.post("http://localhost:3000/api/v1/end-stream/c6c10609-0c33-4768-a589-0a9256a33daf",);
      pc.close();
      mediaStream.current?.getTracks().forEach((track)=>{
        track.stop()
      })


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


      <Button size="lg" onClick={endStream}>
        end live
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
