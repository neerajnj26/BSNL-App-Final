import React, { useEffect, useState } from 'react';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonLabel,
  IonRow,
  IonText,
} from '@ionic/react';
import { chevronDownOutline, chevronUpOutline, trash } from 'ionicons/icons';
import API from '../api/API.js'
import './UpcomingMeetings.scss';
import { useHistory } from 'react-router';

const UpcomingMeetings: React.FC<{ searchSubject: string }> = ({
  searchSubject,
}) => {
  const [meetings, setMeetings] = useState<any[]>([]);
  let [attendees, setAttendees] = useState([])
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [emptyList, setEmptyList] = useState(false)
  
  const currentTimeUTC = Date.now()
  const history = useHistory();

  function getCookie(cookieName: string) {
    const cookieString = document.cookie;
    const cookies = cookieString.split(':');

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(cookieName + '=')) {
        return cookie.substring(cookieName.length + 1);
      }
    }

    return null;
  }

  const token = getCookie('user');

  React.useEffect(() => {
    API.queryConferenceList(token)
      .then((res: any) => {
        const meetingArray = Object.values(res)
          .filter((value) => typeof value === 'object')
          .map((meeting) => meeting);
        setMeetings(meetingArray);

        if(res.message === 'no_upcoming_meetings'){
          setEmptyList(true)
        }
        else{
          setEmptyList(false)
        }
      })
      .catch((err: any) => {
        console.log('Could not fetch meeting details. Please try again later.');
      });
  }, [meetings]);

  //Conversion Functions

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

  const handleJoinConference = (meeting: any) => {
    history.push('/instant-conf', {meeting})
  };

  const handleCancelConference = (meeting: any) => {
      console.log("Removing meeting: ", meeting);
      API.RemoveConference(token, meeting.conferenceKey.conferenceID, "0")
        .then((res: any) => {
          const token = getCookie("user");
          API.queryConferenceList(token)
            .then((res: any) => {
              const meetingArray = Object.values(res)
                .filter((value) => typeof value === "object")
                .map((meeting: Object) => ({
                  ...meeting,
                  expanded: false,
                }));
              setMeetings(meetingArray);
            })
            .catch((err: any) => {
              alert("Could not fetch meeting details. Please try again later.");
            });
        })
        .catch((err: any) => {
          console.log(err);
          alert("Could not end meeting. Please try again later.");
        });
  };

  const handleEditConference = (meeting: any) => {
    history.push('/edit-conf', {meeting})
  }

  const handleFullView = (cardIndex: number) => {
    if (expandedCard === cardIndex) {
      setExpandedCard(null);
    } else {
      setExpandedCard(cardIndex);
    }
  }

  const filteredMeetings = meetings.filter((meeting) =>
  meeting.subject?.toLowerCase().includes(searchSubject.toLowerCase())
);

  return (
    <IonContent className="container-box">
      <IonCard className="container-card">
        <IonCardHeader style={{ borderBottom: '1px solid black', position: 'sticky', top:'0' }}>
          <IonCardTitle style={{ fontSize: '1.3rem' }}>
            Ongoing/Upcoming Meetings
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent className='scrollable-content'>
          {emptyList && 
          <IonText className='empty-message'>No Upcoming Meetings</IonText>
          }
          {filteredMeetings.map((meeting, cardIndex) => (
            <IonCard className="meeting-detail-container" key={cardIndex}>
              <IonCardHeader style={{ display: 'flex', flexDirection: 'row' }}>
                <IonCardTitle
                  style={{ color: '#fff', fontSize: '20px', flex: '1' }}
                >
                  {meeting.subject}
                </IonCardTitle>
                <IonIcon
                  icon={expandedCard === cardIndex
                    ? chevronUpOutline
                    : chevronDownOutline}
                  style={{ fontSize: '1.3rem', marginRight: '10px' }}
                  color="light"
                  onClick={() => handleFullView(cardIndex)}
                />
              </IonCardHeader>
              <IonCardContent className="meeting-details ">
                
                <IonText>
                  Start Time:{' '}
                  {
                    convertUTCMillisecondsToDate(meeting.startTime)
                      .formattedTime
                  }{' '}
                </IonText>
                <br />
                <IonText>
                  Duration:{' '}
                  {convertMillisecondsToHoursAndMinutes(meeting.length).hours}{' '}
                  hour(s){' '}
                  {convertMillisecondsToHoursAndMinutes(meeting.length).minutes}{' '}
                  minute(s){' '}
                </IonText>
                <br />
                <IonText>Creator: {meeting.scheduserName} </IonText>
                <br />
                {
                expandedCard === cardIndex?
                <>
                <IonText>Access Number: {meeting.accessNumber} </IonText>
                <br />
                <IonText>
                  Conf ID: {meeting.conferenceKey.conferenceID}{' '}
                </IonText>
                <br />
                <IonText>Admin Password: {meeting.chair} </IonText>
                <br />
                <IonText>Guest Password: {meeting.general} </IonText>
                <br />
                <IonText>Participants: {meeting.size} </IonText>
                <br />
                <IonText>Attendees:</IonText>
                <br />
                {Array.isArray(meeting.attendees) ? (
                  meeting.attendees.map((attendee: any, index: number) => (
                    <IonChip className="ion-padding" color="light" key={index}>
                      {attendee.attendeeName}
                    </IonChip>
                  ))
                ) : (
                  <IonChip className="ion-padding" color="light">
                    {meeting.attendees?.attendeeName}
                  </IonChip>
                )}
                </>: <></>
                }
                <br />
                
                {currentTimeUTC > meeting.startTime?
                
                <IonButton
                  color="success"
                  expand='block'
                  onClick={() => handleJoinConference(meeting)}
                >
                  Join
                </IonButton>
                :
                  <>
                    <IonButton
                        expand='block'
                        color='light'
                        fill='outline'
                        onClick={() => handleEditConference(meeting)}
                    >
                        Edit 
                    </IonButton>
                    <IonButton
                      style={{marginTop:'0.5rem'}}                     
                      expand='block'
                      color='dark'
                      onClick={() => handleCancelConference(meeting)}
                    >
                      Cancel 
                    </IonButton>
                    </>
                }
              </IonCardContent>
            </IonCard>
          ))}
        </IonCardContent>
      </IonCard>
    </IonContent>
  );
};

export default UpcomingMeetings;
