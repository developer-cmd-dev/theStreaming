"use client"
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import { useRef } from "react";
import { type HttpResponse } from '../node_modules/@repo/zod/index'
export default function Page() {

  const locationVideoRef = useRef<HTMLVideoElement | null>(null);

  const recieverVideoRef = useRef<HTMLVideoElement | null>(null);


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

      const response = await axios.post("http://localhost:8080/api/v1/connect-media-server",
        {
          sdp: offer.sdp,
          type: "offer",
          streamId: "3b560b13-1db5-4b79-adab-489381ed9f90"
        }
        ,
        {
      
        }
      );

      const result = response.data as HttpResponse




      await pc.setRemoteDescription({
        type: 'answer',
        sdp: result.data.sdpAnswer
      })

      const recordingResponse = await axios.get("http://localhost:8080/api/v1/record-streaming/3b560b13-1db5-4b79-adab-489381ed9f90",)
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
        "http://localhost:8889/live/94e194e4-6da0-4ee8-a289-45ba98d697ca/whep",
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
