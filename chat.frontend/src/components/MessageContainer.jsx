import React from 'react'

const MessageContainer = ({ messages }) => {
    return (
        <div>
            <table striped bordered={true}>
                <tbody>
                    {messages.map((msg, index) => (
                        <tr key={index}>
                            <td>{msg.msg} - {msg.username}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default MessageContainer