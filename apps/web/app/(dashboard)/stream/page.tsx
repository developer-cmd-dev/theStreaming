'use client'
import CreateStreamDialog from '@/components/streaming/CreateStreamDialog'
import LiveChat from '@/components/streaming/LiveChat'
import StreamStatus from '@/components/streaming/StreamStatus'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { useStreamState, useUserAuth } from '@/lib/zustandStore'
import { HTTP_BACKEND_URL } from '@/utils/env'
import { axiosHandler } from '@repo/axios'
import { CreatedStreamState, HttpResponse } from '@repo/zod/schema'
import { IconAlertSquareRounded, IconChevronRight, IconEdit, IconHandThreeFingers, IconInfoCircle, IconVideo } from '@tabler/icons-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { clearInterval } from "node:timers";
import { toast } from '@/components/ui/toast'
import { CustomError } from '@repo/customError'


const sessionInfoItems = ['Session', 'Viewers', 'Followers', 'Sub Counts', 'Time Live']

export default function page() {

  const { currentStreamState, setCurrentStreamState } = useStreamState((state) => state);
  const { userPayload } = useUserAuth((state) => state);



  useEffect(() => {


    // const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    //   e.preventDefault();
    //   e.returnValue = "";
    // }

    // window.addEventListener('beforeunload', handleBeforeUnload);




    (async () => {
      if (userPayload && !currentStreamState) {
        try {

          const response = await axiosHandler<HttpResponse<CreatedStreamState[]>>({
            method: "GET",
            url: `${HTTP_BACKEND_URL}/stream`,
            withCredentials: true
          })
          setCurrentStreamState(response.data[0]);

        } catch (error) {
          console.log(error)
        }
      }
    })()


    // return () => {
    //   window.removeEventListener('beforeunload', handleBeforeUnload); // Cleanup
    // };



  }, [userPayload])

  async function checkStreamIsLiveOrNot() {
    try {
      const response = await axiosHandler<HttpResponse>({
        method: "GET",
        url: `${HTTP_BACKEND_URL}/internal/get-obs-stream?streamId=${currentStreamState?.id}`,
        withCredentials: true,
      })
      if (response.status === 200) {
        toast.add({
          type: "success",
          description: response.message
        })

        await connectWebRtc();

        if (currentStreamState) {
          setCurrentStreamState({ ...currentStreamState, isLive: true })
        }



      }
    } catch (error) {
      if (error instanceof CustomError) {
        toast.add({
          type: "error",
          description: error.message
        })
      }
    }
  }


  const videoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  const [iceConnectionStatus, setIceconnectionstatus] = useState<
    "new" | "checking" | "connected" | "completed" | "disconnected" | "failed" | "closed"
  >("disconnected");


  async function connectWebRtc() {
    let stopped = false;
    try {
      const pc = new RTCPeerConnection();

      pcRef.current = pc;

      // We only want to RECEIVE video from MediaMTX.
      pc.addTransceiver("video", {
        direction: "recvonly",
      });

      // If your stream also has audio:
      pc.addTransceiver("audio", {
        direction: "recvonly",
      });

      pc.ontrack = (event) => {
        console.log("Received track:", event.track.kind);

        if (videoRef.current && event.streams[0]) {
          videoRef.current.srcObject = event.streams[0];
        }
      };

      pc.oniceconnectionstatechange = () => {
        console.log(
          "ICE state:",
          pc.iceConnectionState
        );

        switch (pc.iceConnectionState) {
          case "new":
            setIceconnectionstatus("new");
            break;

          case "checking":
            setIceconnectionstatus("checking");
            break;
          case "connected":
            setIceconnectionstatus("connected");
            updateStream({ isLive: true });
            break;
          case "completed":
            setIceconnectionstatus("completed");
            break;
          case "disconnected": {
            stopped = true;
            updateStream({ isLive: false, active: false });
            setIceconnectionstatus("disconnected");

          }
            break;
          case "failed":
            stopped = true;
            setIceconnectionstatus("failed");
            break;
          case "closed":
            stopped = true;
            setIceconnectionstatus("closed");
            break;
          default:
            setIceconnectionstatus("disconnected");

        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Wait for ICE gathering to complete.
      await waitForIceGatheringComplete(pc);

      if (stopped) return;


      const response = await axiosHandler<HttpResponse<{ sdpAnswer: string }>>({
        method: "POST",
        url: `${HTTP_BACKEND_URL}/connect-media-server`,
        data: {
          sdp: pc.localDescription?.sdp,
          type: pc.localDescription?.type,
          streamId: currentStreamState?.id
        },
        withCredentials: true
      })

      if (response.status != 200) {
        throw new Error(
          `WHEP request failed: ${response.status}`
        );
      }

      const answerSdp = response.data.sdpAnswer;

      await pc.setRemoteDescription({
        type: "answer",
        sdp: answerSdp,
      });

      console.log("WebRTC negotiation completed");

    } catch (error) {
      console.error("WebRTC error:", error);
    }

  }


  async function updateStream(data: object) {
    try {
      const response = await axiosHandler<HttpResponse>({
        method: "PUT",
        url: `${HTTP_BACKEND_URL}/stream`,
        data: {
          streamId: currentStreamState?.id,
          data
        },
        withCredentials: true
      })

      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }



  return (
    <>
      <div className='w-full min-[769px]:hidden  text-4xl font-bold flex items-center justify-center '><h1>Use Tablet or Bigger Screen</h1></div>



      <div className="bg-black w-full  p-2 hidden min-[769px]:flex  flex-1 gap-2  ">
        {/* left */}

        <div className='w-1/2 flex flex-col gap-2 h-full'>

          {/* stream info */}

          <div className='w-full h-48 bg-brand-foreground py-2  flex flex-col gap-3 rounded-sm'>

            <Heading icon={<IconAlertSquareRounded />} title='Session Info' />

            <div className="grid grid-cols-5 h-22 border border-x-0">
              {sessionInfoItems.map((value, index) => (<div key={index} className='border-r p-2 flex flex-col justify-around  '>
                {index === 0 ? (<span className='bg-foreground w-fit text-sm px-1 rounded text-background'>{currentStreamState?.isLive ? "ONLINE" : "OFFLINE"}</span>) : (<span>-</span>)}
                <p className='text-text-secondary'>{value}</p>
              </div>))}
            </div>

          </div>

          {/* stream preview */}

          <div className='w-full border flex-1  rounded-sm bg-brand-foreground py-2  overflow-hidden flex flex-col gap-3'>
            <Heading icon={<IconVideo />} title='Stream Preview' className='h-12' />

            {/* {iceConnectionStatus === 'disconnected' ? (
              <div className='relative'>
                <Image src={!currentStreamState ? "/images/offline_banner.avif" : currentStreamState.thumbnail ?? ""}
                  alt="Gaming streaming banner"
                  loading='eager'
                  width={2048}
                  height={200}
                  className="w-full h-auto"
                />
                <StreamStatus className='left-1/2' data={!currentStreamState ? "No active stream" : "Stream is offline"} />
              </div>
            ) : (<video
              id="webrtc-video"
              autoPlay
              playsInline
              controls={false}
              className="w-full h-auto rounded"
              ref={videoRef}
            />


            )} */}
            <video
              id="webrtc-video"
              autoPlay
              playsInline
              controls={false}
              className="w-full h-auto rounded"
              ref={videoRef}
            />



          </div>
        </div>

        <div className='flex gap-2  w-1/2 h-full'>
          <div className=' w-2/3 h-full flex flex-col'>
            <LiveChat className='border-none  bg-brand-foreground rounded-sm ' />
          </div>

          <div className=' w-1/2 h-full flex flex-col gap-2 '>
            <div className='h-1/3 w-full bg-brand-foreground rounded-sm flex flex-col flex-1 '>
              <div className='h-fit'>
                <Heading title='Stream Info' icon={<IconInfoCircle />} className='h-11' />
                <Separator />
              </div>

              {
                !currentStreamState ? (
                  <div className='h-full flex items-center justify-center '>
                    <CreateStreamDialog>
                      <span className='bg-brand px-3 py-2 text-background rounded-md text-sm font-semibold hover:bg-foreground cursor-pointer transition ease-in-out delay-100 '>Create Stream</span>
                    </CreateStreamDialog>
                  </div>
                ) : (

                  <div className='w-full h-full flex flex-col   items-center p-2 justify-start'>
                    <div className='flex  items-center justify-between w-full  '>
                      <h1 className='text-primary font-semibold'>
                        {currentStreamState.title}
                      </h1>
                      <Button className={`h-6`}>
                        <IconEdit />
                      </Button>
                    </div>

                    <div className='flex items-center justify-start w-full'>
                      <p className='text-text-muted'>
                        {currentStreamState.description}
                      </p>

                    </div>

                    <div className=' w-full h-full flex items-center justify-center'>
                      <Button size={"lg"} onClick={() => checkStreamIsLiveOrNot()}>
                        Connect with OBS
                      </Button>
                    </div>
                  </div>
                )
              }



            </div>

            <div className='w-full h-2/3 bg-brand-foreground rounded-sm '>
              <Heading title='Channel Actions' icon={<IconHandThreeFingers />} className='h-12' />
              <Separator />

              <div className='h-full w-full px-3'>
                {
                  channelActionSections.map((value, index) => (

                    < div key={index}>
                      <div className='w-full flex flex-col gap-3 py-3'>
                        <h1 className='text-xl'>{value.title}</h1>
                        {value.items.map((items, id) => (
                          <div key={id} className='flex items-center w-full justify-between'>
                            <p className='text-text-secondary text-sm'>{items.label}</p>
                            {items.type === 'navigation' ? (<span className=' text-sm flex items-center justify-center text-text-secondary'>{items.value} <IconChevronRight /></span>) : (<Switch />)}
                          </div>
                        ))}
                      </div>
                      <Separator />
                    </div>


                  ))
                }
              </div>

            </div>

          </div>

          <div className='h-full'>

          </div>
        </div>
      </div>
    </>
  )







}



function Heading({ title, icon, className }: { title: string, icon: React.ReactNode, className?: string }) {
  return (
    <div className={cn('h-10 px-6 flex gap-4 items-center ', className)}>
      {icon}
      <h1 className='text-md xl:text-xl font-semibold'>{title}</h1>
    </div>
  )
}

function waitForIceGatheringComplete(
  pc: RTCPeerConnection
): Promise<void> {
  return new Promise((resolve) => {
    if (pc.iceGatheringState === "complete") {
      resolve();
      return;
    }

    const checkState = () => {
      if (pc.iceGatheringState === "complete") {
        pc.removeEventListener(
          "icegatheringstatechange",
          checkState
        );

        resolve();
      }
    };

    pc.addEventListener(
      "icegatheringstatechange",
      checkState
    );
  });
}


const channelActionSections = [
  {
    title: "Chat access",
    items: [
      {
        label: "Account age",
        type: "navigation",
        value: "Off",
      },
      {
        label: "Followers only",
        type: "navigation",
        value: "Off",
      },
      {
        label: "Subscribers only",
        type: "switch",
        value: false,
      },
    ],
  },

  {
    title: "Chat options",
    items: [
      {
        label: "Emotes only",
        type: "switch",
        value: false,
      },
      {
        label: "Slow mode",
        type: "navigation",
        value: "Off",
      },
      {
        label: "Banned words",
        type: "navigation",
      },
      {
        label: "AI Chat Moderation",
        type: "external",
      },
    ],
  },

  {
    title: "Channel options",
    items: [
      {
        label: "Show view count",
        type: "switch",
        value: true,
      },
      {
        label: "Raid Channel",
        type: "navigation",
        disabled: true,
      },
      {
        label: "Set goals",
        type: "navigation",
      },
    ],
  },
];