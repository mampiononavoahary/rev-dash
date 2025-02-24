'use client';

import { Button, ButtonProps } from '@/components/ui/button'
import React from 'react'
import { useFormStatus } from 'react-dom'

export const SubmitButton = (props:ButtonProps) =>{
    const {pending} = useFormStatus();

    return <Button {...props} disabled={props.disabled || pending}/>
}
