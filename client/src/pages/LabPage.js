import React, { Suspense } from 'react'
import { useHistory } from "react-router-dom";
import { Figure, Image, Caption } from 'react-bootstrap';
import Popout from '../components/Popout';
import SideNav from '../components/Controls';
const PhaserWorld = React.lazy(() => import('../components/PhaserWorld'));




const LabPage = () => {

    const history = useHistory()
    const previous = () => { history.goBack() }

    const controls = () => {
        
    }

    return (
        <div>
            <button class="clickable" onClick={previous}>Back</button>
            <SideNav />
                
            <Suspense fallback={<div>Loading...</div>}>
                < PhaserWorld width={600} height={600} worldType="Camerafun"/>
                < PhaserWorld width={200} height={150} worldType="Colorfun"/>
                < PhaserWorld width={400} height={275} worldType="Shaderfun"/>
                < PhaserWorld width={400} height={275} worldType="Lab"/>
            </Suspense>
        </div>
    )
};

export default LabPage;