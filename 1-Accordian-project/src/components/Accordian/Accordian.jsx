import React, { useState } from 'react'
import data from './data'
import './styles.css'

function Accordian() {
    const [selected, setSelected] = useState(null)
    const [enablemultiselection, setMultiSelection] = useState(false)
    const [multiple, setMultiple] = useState([])
    const handleSingleSelection = function (getCurrentID) {
        setSelected(getCurrentID === selected ? null : getCurrentID)
    }
    const handleMultiSelection = function (getCurrentID) {
        let cpyMultiple = [...multiple];
        const findIndexOfCurrentId = cpyMultiple.indexOf(getCurrentID)
        // console.log(findIndexOfCurrentId);
        if(findIndexOfCurrentId === -1){
            cpyMultiple.push(getCurrentID)
        }
        else{
            cpyMultiple.splice(findIndexOfCurrentId, 1)
        }
        
        setMultiple(cpyMultiple)
    }
    return (
        <div className='wrapper'>
            {/* ye code Accordian components ko toggle kare ga  */}
            <button onClick={() => setMultiSelection(!enablemultiselection)}>Enable Multiple Selection</button>
            <div className='Accordian'>
                {data && data.length > 0 ? (
                    data.map((dataItems) => (
                        <div className='items' key={dataItems.id}>
                            <div className='title' onClick={enablemultiselection ? () => handleMultiSelection(dataItems.id) : () => handleSingleSelection(dataItems.id)}>
                                <h3>{dataItems.question}</h3>
                                <span>{selected === dataItems.id ? '−' : '+'}</span>
                            </div>
                            {
                                enablemultiselection  ? multiple.indexOf(dataItems.id) !== -1 && (
                                    <div className='content'>{dataItems.answer}</div>
                                )
                                : selected  === dataItems.id && (
                                    <div className='content'>{dataItems.answer}</div>
                                )
                            }
                            {/* {selected === dataItems.id || multiple.indexOf(dataItems.id !== -1) ? (
                                <div className='content'>{dataItems.answer}</div>
                            ) : null} */}
                        </div>
                    ))
                ) : (
                    <div className='no-data'>No data found</div>
                )}
            </div>
        </div>
    )
}

export default Accordian