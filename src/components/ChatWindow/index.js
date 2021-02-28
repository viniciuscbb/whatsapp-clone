import React, { useState, useEffect, useRef } from "react";
import { Search, AttachFile, MoreVert, InsertEmoticon, Close, Send, Mic, EmojiObjects } from '@material-ui/icons'
import EmojiPicker from 'emoji-picker-react'
import './index.css'

import Api from '../../Api'

import MessageItem from '../MessageItem'

export default ({ user, data }) => {
    const body = useRef()

    let recognition = null
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if(SpeechRecognition !== undefined){
        recognition = new SpeechRecognition()
    }

    const [ emojiOpen, setEmojiOpen ] = useState(false)
    const [ text, setText ] = useState('')
    const [ listening, setListening ] = useState(false)
    const [ list, setList ] = useState([])
    const [ users, setUsers ] = useState([])

    useEffect(()=> {
        setList([])
        let unsub = Api.onChatContent(data.chatId, setList, setUsers)
        return unsub
    }, [data.chatId])


    useEffect(()=> {
        if(body.current.scrollHeight > body.current.offsetHeight){
            body.current.scrollTop = body.current.scrollHeight - body.current.offsetHeight
        }
    }, [list])

    const handleEmojiClick = (e, emojiObject) => {
        setText(text + emojiObject.emoji)
    }
    
    const handleOpenEmoji = () => {
        setEmojiOpen(true)
    }

    const handleCloseEmoji = () => {
        setEmojiOpen(false)
    }

    const handleSendClick = () => {
        if(text !== ''){
            Api.sendMessage(data, user.id, 'text', text, users)
            setText('')
            setEmojiOpen(false)
        }
    }
    
    const handleInputKeyUp = (e) => {
        if(e.keyCode == 13){
            handleSendClick()
        }
    }
    const handleMicClick = () => {
        if(recognition !== null){
            recognition.onstart = () => {
                setListening(true)
            }
            recognition.onend = () => {
                setListening(false)
            }
            recognition.onresult = (e) => {
                setText(e.results[0][0].transcript)
            }

            recognition.start()
        }
    }

    return (
        <div className="chaWindow">
            <header>
                <div className="headerInfo">
                    <img className="headerAvatar" src={data.image} alt="Avatar Header"/>
                    <div className="headerName">{data.title}</div>
                </div>
                <div className="headerButtons">
                    <div className="headerBtn">
                        <Search style={{ color: '#919191'}} />
                    </div>                    
                    <div className="headerBtn">
                        <AttachFile style={{ color: '#919191'}} />
                    </div>
                    <div className="headerBtn">
                        <MoreVert style={{ color: '#919191'}} />
                    </div>
                </div>
            </header>
            <main ref={body}>
                {list.map((item, key)=> (
                    <MessageItem
                        key={key}
                        data={item}
                        user={user}
                    />
                ))}
            </main>

            <div 
                className="chatWindow--emojiarea" 
                style={{height: emojiOpen ? '200px' : '0px'}}
            >
                <EmojiPicker 
                    onEmojiClick={handleEmojiClick}
                    disableSearchBar
                    disableSkinTonePicker
                />
            </div>
            <footer>
                <div className="footerPre">
                    <div 
                        className="headerBtn"
                        onClick={handleCloseEmoji}
                        style={{width: emojiOpen ? '40px' : '0px'}}
                    >
                        <Close style={{ color: '#919191'}} />
                    </div>
                    <div 
                        className="headerBtn"
                        onClick={handleOpenEmoji}
                    >
                        <InsertEmoticon style={{ color: emojiOpen ? '#009688' : '#919191'}} />
                    </div>
                    
                </div>
                <div className="footerInputArea">
                    <input 
                        className="footerInput" 
                        type="text"
                        placeholder="Digite uma mensagem"
                        value={text}
                        onChange={e=>setText(e.target.value)}
                        onKeyUp={handleInputKeyUp}
                    />
                </div>
                <div className="footerPos">
                    {text === '' && 
                        <div 
                            className="headerBtn"
                            onClick={handleMicClick}
                        >
                            <Mic style={{ color: listening ? '#126ECE' : '#919191'}} />
                        </div>
                    }
                    {text !== '' && 
                        <div 
                            className="headerBtn"
                            onClick={handleSendClick}
                        >
                            <Send style={{ color: '#919191'}} />
                        </div>
                    }
                </div>
            </footer>
        </div>
    )
}