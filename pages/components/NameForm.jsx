import React from 'react';

const NameForm = ({
    name,
    onNameChange,
    message,
    onMessageChange,
    buyCoffee,
    connectWallet,
    currentAccount,
    memos,
}) => {
    const stylizeTimestamp = (timestamp) => {
        let date = new Date(timestamp * 1000);

        return date;
    };
    return (
        <div className="main-content">
            <div className='square'></div>
            <main>
                {currentAccount ? (
                    <div>
                        <form>
                            <div className="input-container">
                                <div className="con">
                                    <label className="label-text">Name</label>
                                    <textarea
                                        id="name"
                                        type="text"
                                        placeholder="Your name"
                                        className='input-textarea'
                                        value={name}
                                        onChange=
                                        {onNameChange}
                                    />
                                </div>
                                <div className="con2">
                                    <label className="label-text">Message</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Enjoy your coffee!"
                                        id="message"
                                        value={message}
                                        onChange={onMessageChange}
                                        required
                                    ></textarea>
                                </div>
                                <div className="button-content">
                                    <button type="button" onClick={buyCoffee}>
                                        Buy Coffee for 0.001 MATIC
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="button-content">
                        <button className='-' onClick={connectWallet}>Connect your wallet</button></div>
                )}
            </main>

            {currentAccount && (
                <div className='memo-main'>
                    <h2 className='label-text-5'>Recent</h2>
                    {memos.map((memo, idx) => (
                        <div key={idx} className='memo'>
                            <h1 className='label-text-3'> {"MESSAGE:"} <p className='label-text-4'>&quot;{memo.message}&quot;</p></h1>

                            <h1 className='label-text-3'>{"NAME:"}  <p className='label-text-4'> {memo.name} ({currentAccount})</p></h1>

                            <h1 className='label-text-3'>{"Time"}:
                                <p className='label-text-4'>
                                    {stylizeTimestamp(memo.timestamp).toString()}
                                </p>
                            </h1>

                        </div>
                    ))}
                    <footer>
                        <div className='footer'>
                            <h1>&quot;Just a sip away from a fresh cup of creativity. Help fuel my day!&quot;</h1>
                        </div>
                    </footer>
                </div>
            )
            }


        </div >
    );
};

export default NameForm;
