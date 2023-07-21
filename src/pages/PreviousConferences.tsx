import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonIcon, IonRow, IonText } from "@ionic/react";
import './UpcomingMeetings.scss'

import API from '../api/API.js'
import { useEffect, useState } from "react";
import { chevronBackOutline, chevronForwardOutline } from "ionicons/icons";

const PreviousConferences: React.FC = () => {

    const [meetings, setMeetings] = useState([]);
    const [totalPages, setTotalPages] = useState(28);
    const [pageIndex, setPageIndex] = useState(totalPages);

    const handleLeftClick = () => {
        setPageIndex(pageIndex+1);
    }

    const handleRightClick = () => {
        setPageIndex(pageIndex-1);
    }

    const convertUTCMillisecondsToDate = (utcMilliseconds: any) => {
        // Create a new Date object with the UTC milliseconds
        var date = new Date(parseInt(utcMilliseconds, 10));
    
        // Specify the time zone as 'Asia/Kolkata' for Indian time
        var options = { timeZone: 'Asia/Kolkata' };
    
        // Extract the different components of the date in Indian time
        var year = date.toLocaleString('en-IN', {
          year: 'numeric',
          timeZone: 'Asia/Kolkata',
        });
        var month = date.toLocaleString('en-IN', {
          month: '2-digit',
          timeZone: 'Asia/Kolkata',
        });
        var day = date.toLocaleString('en-IN', {
          day: '2-digit',
          timeZone: 'Asia/Kolkata',
        });
        var hours = date.toLocaleString('en-IN', {
          hour: '2-digit',
          hour12: false,
          timeZone: 'Asia/Kolkata',
        });
        var minutes = date.toLocaleString('en-IN', {
          minute: '2-digit',
          timeZone: 'Asia/Kolkata',
        });
    
        // Format the date and time string
        var formattedDate = year + '-' + month + '-' + day;
        var formattedTime = hours + ':' + (parseInt(minutes) < 10? `0${minutes}`: minutes);    
        // Return the formatted date and time
        
        return {
          year: year,
          month: month,
          day: day,
          hours: hours,
          minutes: minutes,
          formattedDate: formattedDate,
          formattedTime: formattedTime,
        };
      };    

    const convertMillisecondsToHoursAndMinutes = (milliseconds: any) => {
    var hours = Math.floor(milliseconds / (1000 * 60 * 60));
    var minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));

    return { hours: hours, minutes: minutes };
    };

    function getCookie(cookieName: any) {
        const cookieString = document.cookie;
        const cookies = cookieString.split(':');
  
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.startsWith(cookieName + '=')) {
            return cookie.substring(cookieName.length + 1);
          }
        }
  
        return null; // Return null if the cookie is not found
      }

    useEffect(() => {
        const token = getCookie("user");
        API.queryConferencehistory(token, pageIndex)
          .then((res) => {
            const meetingArray = Object.values(res)
              .filter((value) => typeof value === "object")
              .map((meeting) => meeting);
            setMeetings(meetingArray.reverse());
            console.log(res)
          })
          .catch((err) => {
            alert("Could not fetch meeting history. Please try again later.");
          });
      }, [pageIndex]);

    return (
    <IonContent className="container-box">
        <IonCard className="container-card">
            <IonCardHeader style={{borderBottom: '1px solid black', display: 'flex', flexDirection: 'row', position: 'sticky', top:'0'}}>
                <IonCardTitle style={{fontSize:'1.3rem', flex: '1'}}>Previous Conferences</IonCardTitle>
                <IonIcon icon={chevronBackOutline} style={{fontSize:'1.3rem', marginRight: '7.5px'}} onClick={handleLeftClick}/>
                <IonIcon icon={chevronForwardOutline} style={{fontSize:'1.3rem', marginLeft: '7.5px'}} onClick={handleRightClick} />
            </IonCardHeader>
            <IonCardContent className="scrollable-content">
            {meetings.map((meeting, index) => (
            <IonCard className="meeting-detail-container" key={index}>
            <IonCardHeader>
                <IonCardTitle style={{color:'#fff', fontSize: '20px'}}>{meeting.subject}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="meeting-details ">
                <IonGrid>
                    <IonRow>
                        <IonCol className="ion-no-padding" size="6">
                        <IonText>Creator</IonText><br />
                        </IonCol>
                        <IonCol className="ion-no-padding" size="6" style={{textAlign:'left'}}>
                        <IonText>: {meeting.scheduserName}</IonText><br />
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol className="ion-no-padding" size="6">
                        <IonText>Conference ID</IonText><br />
                        </IonCol>
                        <IonCol className="ion-no-padding" size="6" style={{textAlign:'left'}}>
                        <IonText>: {meeting.conferenceKey?.conferenceID ?? ''}</IonText><br />
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol className="ion-no-padding" size="6">
                            <IonText>No of Participants</IonText><br />
                        </IonCol>
                        <IonCol className="ion-no-padding" size="6">
                            <IonText>: {meeting.size}</IonText><br />
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol className="ion-no-padding" size="6">
                            <IonText>Start Time</IonText><br />
                        </IonCol>
                        <IonCol className="ion-no-padding" size="6">
                            <IonText>: {convertUTCMillisecondsToDate(meeting.startTime).formattedDate} {convertUTCMillisecondsToDate(meeting.startTime).formattedTime}</IonText><br />
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol className="ion-no-padding" size="6">
                            <IonText>Duration</IonText>
                        </IonCol>
                        <IonCol className="ion-no-padding" size="6">
                            <IonText>: {convertMillisecondsToHoursAndMinutes(meeting.length).hours+" hour(s) "+ 
                                        convertMillisecondsToHoursAndMinutes(meeting.length).minutes + " minute(s)"}</IonText>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonCardContent>
            </IonCard>
             ))}
            </IonCardContent>
        </IonCard>
    </IonContent>    
    )
}

export default PreviousConferences;