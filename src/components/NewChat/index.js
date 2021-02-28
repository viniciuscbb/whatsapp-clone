import React, { useState, useEffect } from 'react'
import './index.css'
import { ArrowBack } from '@material-ui/icons'

import Api from '../../Api'


export default ({user, chatList, show, setShow}) => {

    const [list, setList] = useState([])

    const handleClose = () => {
        setShow(false)
    }

    useEffect(() => {
        const getList = async () => {
            if(user !== null){
                let results = await Api.getContatcList(user.id)
                setList(results)
            }
        }
        getList()
    }, [user])

    const addNewChat = async (user2) => {
        await Api.addNewChat(user, user2)

        handleClose(false)
    }

    return (
        <div className="newChat" style={{left: show ? 0 : -415}}>
            <div className="newChat--head">
                <div onClick={handleClose} className="newChat--backbutton">
                    <ArrowBack style={{color: '#fff'}}/>
                </div>
                <div className="newChat--headtitle">Nova conversa</div>
            </div>
            <div className="newChat--list">
                {list.map((item, key) => (
                    <div onClick={() =>addNewChat(item)} className="newChat--item" key={key}>
                        <img className="newChat--itemavatar" src={item.avatar} alt="Avatar"/>
                        <div className="newChat--itemname">{item.name}</div>
                    </div>

                ))}
            </div>
        </div>
    )
}
