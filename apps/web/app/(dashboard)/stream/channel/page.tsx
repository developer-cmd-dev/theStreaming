"use client"
import { Input } from '@/components/ui/input';
import { Separator } from '@base-ui/react/separator';
import { IconEye } from '@tabler/icons-react';
import { EyeClosed } from 'lucide-react';
import React, { useState } from 'react'

function page() {
  const [secret,setSecret]=useState<{id:number,isSecret:boolean}>()
  return (
    <div className='w-full flex flex-col  h-[95vh] '>
      <div className='text-3xl h-24 flex items-center justify-center' >
        <h1>Stream url & key</h1>
      </div>

      <div className='w-1/2 m-auto overflow-y-scroll  '>
        {streamSettings.map((data, index) => (
          <div key={index} className='w-full p-5 flex flex-col gap-2 text-2xl bg-surface'>
            <h1>{data.title}</h1>

            {
              data.type === 'secret' ? ( data.fields?.map((fields,fieldId)=>(
                <div key={fieldId} className='relative flex'>
                <Input className='rounded-none h-12 text-2xl' type={secret?.id === fieldId && secret.isSecret?"text" : fields.type} value={fields.value} name={fields.name} />
                <span onClick={()=>setSecret({id:fieldId,isSecret:secret?.isSecret ? !secret.isSecret : true})} className='absolute right-4 top-3 text-sm'><IconEye /></span>
              </div>
              ))) : (
                data.fields?.map((fields,fieldId)=>(
                  <div key={fieldId}>
                  <label className='text-sm'>{fields.label}</label>
                  <Input className='rounded-none h-12 text-2xl' type={fields.type} value={fields.value} name={fields.name} />
                </div>
                ))
              )
            }

          </div>
        ))}

      </div>
    </div>
  )
}

export default page

interface StreamSettingField {
  name: string;
  type: string;
  value?: string;
  label?: string;
  showToggle?: boolean;
  reset?: boolean;
  copy?: boolean;
  info?: boolean;
}

interface StreamSetting {
  title: string;
  type: 'secret' | 'encoding' | 'collapsible' | string;
  fields?: StreamSettingField[];
  description?: string;
  downloadProfile?: boolean;
}

const streamSettings: StreamSetting[] = [
  {
    title: "Stream URL",
    type: "secret",
    fields: [
      {
        name: "streamUrl",
        type: "password",
        value: "rtmp://your-server/live",
        showToggle: true,
      },
    ],
  },

  {
    title: "Stream Key",
    type: "secret",
    fields: [
      {
        name: "streamKey",
        type: "password",
        value: "your-stream-key",
        showToggle: true,
        reset: true,
      },
    ],
  },

  {
    title: "Recommended Encoding Settings",
    type: "encoding",
    description:
      "Here are our recommended encoding settings for your broadcasting software. For more information, check out our support documentation.",

    fields: [
      {
        name: "outputResolution",
        label: "Output Resolution",
        type: "text",
        value: "1920×1080",
        copy: true,
      },
      {
        name: "framerate",
        label: "Framerate",
        type: "text",
        value: "60",
        copy: true,
      },
      {
        name: "rateControl",
        label: "Rate Control",
        type: "text",
        value: "CBR",
      },
      {
        name: "bitrate",
        label: "Bitrate (Kbps)",
        type: "text",
        value: "8000",
        copy: true,
        info: true,
      },
      {
        name: "keyframeInterval",
        label: "Keyframe Interval (seconds)",
        type: "text",
        value: "2",
        copy: true,
      },
    ],

    downloadProfile: true,
  },

  {
    title: "Advanced Settings",
    type: "collapsible",
    description:
      "Configure advanced streaming protocols and endpoints.",
  },
];