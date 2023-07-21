import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButton,
    IonMenuButton,
    IonItem,
    IonInput,
    IonSelectOption,
    IonSelect,
    IonLabel,
    IonFab,
    IonFabButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonAlert,
    IonChip,
    IonRefresher,
    IonRefresherContent,
    IonButtons,
    IonText,
  } from '@ionic/react';
  import React, { useEffect, useState } from 'react';
  import './CreateConference.scss'
  import { add, closeCircle, time } from 'ionicons/icons';
  import API from '../api/API.js'
  import { RouteComponentProps, useLocation, useHistory } from 'react-router';
  import ModalCreateConf from '../components/ModalCreateConf';

  interface LocationState {
    meeting: any;
  }
  
  const inputStyles = {
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    textIndent: '12px',
  };
  
  const EditConference:  React.FC<RouteComponentProps<any, any, LocationState>> = ({location}) => {

    const { meeting } = location.state || {};


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

    const [showModal, setShowModal] = useState<boolean>(false)
    const [participantName, setParticipantName] = useState<string[]>([])
    const [subject, setSubject] = useState<string>(meeting?.subject || '');
    const [date, setDate] = useState<string>(
        meeting?.startTime
          ? convertUTCMillisecondsToDate(meeting?.startTime).formattedDate
          : '');
    const [timeValue, setTimeValue] = useState<string>(
        meeting?.startTime
        ? convertUTCMillisecondsToDate(meeting?.startTime).formattedTime
        : ''
    );
    const [durationValue, setDurationValue] = useState<string>(
        meeting?.length 
        ? convertMillisecondsToHoursAndMinutes(meeting?.length).hours + ' hour(s)' + convertMillisecondsToHoursAndMinutes(meeting?.length).minutes + ' minute(s)'
        : ''
    );
    const [participantNum, setParticipantNum] = useState<string>(meeting?.size);
    const [contacts, setContacts] = useState<string[]>([]);
    const [groups, setGroups] = useState<string[]>([]);
    const [participants, setParticipants] = useState([]);
    const [openConfirmation, setOpenConfirmation] = useState(false)

    useEffect(() => {
        if (meeting?.attendees) {
          let attendeesArray = [];
          if (Array.isArray(meeting.attendees)) {
            attendeesArray = meeting.attendees;
          } else {
            attendeesArray = [meeting.attendees];
          }
          const attendeeNames = attendeesArray.map((attendee) => attendee?.attendeeName);
          setParticipantName(attendeeNames);
        }
      }, [meeting]);

    // To convert the start date into day, month and year
  
      const parseDate = (dateString: string) => {
        const dateObj = new Date(dateString);
        const day = dateObj.getDate();
        const month = dateObj.getMonth() + 1; // January is 0
        const year = dateObj.getFullYear();
    
        return { day, month, year };
      };
  
      const parseTime = (timeString: string) => {
        const timeObj = new Date(`1970-01-01T${timeString}`);
        const hour = timeObj.getHours();
        const minutes = timeObj.getMinutes();
  
        return { hour, minutes}
      }
  
      const history = useHistory();
  
      const parsedDate = parseDate(date);
      const parsedTime = parseTime(timeValue);
      const participantNumInt = parseInt(participantNum, 10)
  
      const handleScheduleClick = () => {
        setOpenConfirmation(true)
      }

      const handleConfirmEdit = () => {
        setSubject('')
        setDate('')
        setTimeValue('')
        setDurationValue('')
        setParticipantNum('')
        setContacts([])
        setGroups([])
        
        const durationInMinutes = parseInt(durationValue, 10)
        const durationInMilliSeconds = durationInMinutes * 60 * 1000;
  
        const selectedDate = new Date(
          `${parsedDate.month} ${parsedDate.day}, ${parsedDate.year} ${parsedTime.hour}:${parsedTime.minutes}`
        )
  
        const utcTimestamp = selectedDate.getTime();
        const formattedStartTimeUTC = utcTimestamp.toString();
        
        setOpenConfirmation(true);

        function getCookie(cookieName: any) {
          const cookieString = document.cookie;
          const cookies = cookieString.split(":");
    
          for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(cookieName + "=")) {
              return cookie.substring(cookieName.length + 1);
            }
          }
    
          return null; // Return null if the cookie is not found
        }
  
        var token = getCookie("user");
  
        API.ModifyConference(
          token,
          meeting.conferenceKey.conferenceID,
          "0",
          durationInMilliSeconds,
          participantNumInt,
          48,
          "en_US",
          subject,
          formattedStartTimeUTC, 
          participants
        )
            
        .then((res) => {
            console.log(res);
            if (res.result.resultDesc === "UNAUTHORIZED") {
              alert("Session Expired. Please login again.");
              history.push("/");
            }
          })
        .catch((err: any)=>{
          console.log(err)
        })
  
        history.replace('/schedule-confirmation');
      }

      const handleCancelEdit = () => {
        setOpenConfirmation(false);
      };
  
      const handleAddContactGroup = () => {
        setParticipants((prevParticipants) => [...prevParticipants, ...contacts, ...groups]);
        setContacts([])
        setGroups([])
      };
  
      const handleAddExternalParticipant = () => {
          setShowModal(true)
      }
  
      const handleAddParticipant = (name: string, phoneNumber: string) => {
        const newContact = {
          attendeeName: `${name}`,
          conferenceRole: 'general',
          addressEntry: [
            {
              address: `${phoneNumber}`,
              type: 'phone'
            }
          ]
        }
        setParticipants((prevParticipants) => [...prevParticipants, newContact]);
        console.log(participants)
        setParticipantName((prevParticipants) => [...prevParticipants, name]);
      }
  
      const handleRemoveParticipant = (index: number) => {
        const updatedParticipants = [...participants];
        updatedParticipants.splice(index, 1);
        setParticipants(updatedParticipants);
        const updatedParticipantNames = [...participantName];
        updatedParticipantNames.splice(index, 1);
        setParticipantName(updatedParticipantNames);
      };
  
      const doRefresh = (event) => {
        setTimeout(() => {
          event.detail.complete(); 
        }, 2000); 
      };
  
    return (
      <IonPage>
        <IonHeader translucent={true}>
          <IonToolbar>
            <IonMenuButton slot="start"></IonMenuButton>
            <IonButtons slot='end'>
                <IonButton onClick={() => history.goBack()}>Close</IonButton>
            </IonButtons>
            <IonTitle className='create-conf-title'>Create Conference</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen={false} className='ion-padding'>
          <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
              <IonRefresherContent></IonRefresherContent>
            </IonRefresher>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Edit Conference</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonItem className='item'>
            <IonLabel position='stacked'><b>Subject</b></IonLabel>
            <IonInput
              value={subject}
              style={inputStyles}
              placeholder="Enter subject"
              onIonInput={(event) => setSubject(event.detail.value! as string)}
            />
          </IonItem>
          <IonItem className='item'>
            <IonLabel position='stacked'><b>Date</b></IonLabel>
            <IonInput
              value={date}
              style={inputStyles}
              type="date"
              onIonInput={(event) => setDate(event.detail.value! as string)}
            />
          </IonItem>
          <IonItem className='item'>
            <IonLabel position='stacked'><b>Start Time</b></IonLabel>
            <IonInput
              style={inputStyles}
              type="time"
              value={timeValue}
              placeholder="HH:MM"
              onIonInput={(event) => setTimeValue(event.detail.value! as string)}
            />
          </IonItem>
          <IonItem className='item'>
            <IonLabel position='stacked'><b>Duration</b></IonLabel>
            <IonSelect
              style={inputStyles}
              placeholder="Select Duration"
              value={durationValue}
              onIonChange={(event) => setDurationValue(event.detail.value! as string)}
            >
              <IonSelectOption value="15">15 minute(s)</IonSelectOption>
              <IonSelectOption value="30">30 minute(s)</IonSelectOption>
              <IonSelectOption value="60">1 hour(s)</IonSelectOption>
              <IonSelectOption value="90">1 hour(s) 30 minute(s)</IonSelectOption>
              <IonSelectOption value="120">2 hour(s)</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem className='item'>
            <IonLabel position='stacked'><b>Participants</b></IonLabel>
            <IonSelect
              value={participantNum}
              style={inputStyles}
              placeholder="Number of Participants"
              onIonChange={(event)=> setParticipantNum(event.detail.value)}
            >
              <IonSelectOption value="3">3</IonSelectOption>
              <IonSelectOption value="4">4</IonSelectOption>
              <IonSelectOption value="5">5</IonSelectOption>
              <IonSelectOption value="6">6</IonSelectOption>
              <IonSelectOption value="7">7</IonSelectOption>
              <IonSelectOption value="8">8</IonSelectOption>
              <IonSelectOption value="9">9</IonSelectOption>
              <IonSelectOption value="10">10</IonSelectOption>            
            </IonSelect>
          </IonItem>
          <IonItem className='item'>
            <IonLabel position='stacked'><b>Add Contacts</b></IonLabel>
            <IonSelect
              value={contacts}
              style={inputStyles}
              placeholder="Select Contacts"
              multiple={true}
              onIonChange={(event) => setContacts(event.detail.value!)}
            >
              <IonSelectOption>Neerali</IonSelectOption>
              <IonSelectOption>Krishnali</IonSelectOption>
              <IonSelectOption>Asoon</IonSelectOption>
              <IonSelectOption>Assaai Mon</IonSelectOption>
              <IonSelectOption>Njandu</IonSelectOption>
              <IonSelectOption>Scambot</IonSelectOption>
              <IonSelectOption>Ardraali</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem className='item'>
            <IonLabel position='stacked'><b>Add Groups</b></IonLabel>
            <IonSelect
              value={groups}
              style={inputStyles}
              placeholder="Select Groups"
              multiple={true}
              onIonChange={(event) => setGroups(event.detail.value)}
            >
              <IonSelectOption>Group 1</IonSelectOption>
              <IonSelectOption>Group 2</IonSelectOption>
              <IonSelectOption>Group 3</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonGrid>
            <IonRow>
              <IonCol size='6'>
                <IonButton      
                  className='add-participants-btn'            
                  onClick={handleAddContactGroup}>Add Contacts/<br />Groups</IonButton>
              </IonCol> 
              <IonCol size='6'>        
                <IonButton      
                  className='add-participants-btn'                
                  onClick={handleAddExternalParticipant}>
                    Add External<br /> Participant
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
  
             <h2 style={{fontFamily:'system-ui'}}>Participants:</h2>
             <IonContent className='ion-padding participants-box'>
              {participantName.map((participant, index) => (
              <IonChip key={index}>
                <IonLabel>{participant}</IonLabel>
                <IonIcon 
                icon={closeCircle}
                onClick={() => handleRemoveParticipant(index)} />
              </IonChip>
             ))}
             </IonContent>
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton onClick={handleScheduleClick}>
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>
          <ModalCreateConf
              isOpen={showModal}
              onAddParticipant={handleAddParticipant}
              onClose={() => setShowModal(false)}
            />
            <IonAlert
            isOpen={openConfirmation}
            header="Confirmation"
            message="Do you really want to edit your conference details?"
            buttons={[
                {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'secondary',
                handler: handleCancelEdit,
                },
                {
                text: 'Confirm',
                handler: handleConfirmEdit,
                },
            ]}
            />
        </IonContent>
      </IonPage>
    );
  };
  
  export default EditConference;
  