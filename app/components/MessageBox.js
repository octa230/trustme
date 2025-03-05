import React from 'react'
import { Alert } from 'react-bootstrap'

const MessageBox = (props) =><Alert variant={props.variant || 'info'} className='h-25 align-self-center my-1'>
    {props.children}
</Alert>

export default MessageBox
