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
} from '@ionic/react';
import React, { useState } from 'react';
import './CreateConference.scss'
import { add, closeCircle, time } from 'ionicons/icons';
import API from '../api/API.js'
import { useHistory } from 'react-router';
import ModalCall from '../components/ModalCall';

const inputStyles = {
  border: '1px solid #d9d9d9',
  borderRadius: '4px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  textIndent: '12px',
};

const CreateConference: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [participantName, setParticipantName] = useState<string[]>([])
  const [subject, setSubject] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [timeValue, setTimeValue] = useState<string>('');
  const [durationValue, setDurationValue] = useState<string>('');
  const [participantNum, setParticipantNum] = useState<string>('');
  const [contacts, setContacts] = useState<string[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [participants, setParticipants] = useState([]);

  //To convert the start date into day, month and year

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

      API.createconference(
        token,
        durationInMilliSeconds,
        participantNumInt,
        48,
        "en_US",
        subject,
        formattedStartTimeUTC,
        false, 
        participants
      )

      .then((res) => {
        console.log(res);
      }).catch((err)=>{
        console.log(err)
      })

      history.replace('/schedule-confirmation');
    }

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
          <IonTitle className='create-conf-title'>Create Conference</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={false} className='ion-padding'>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Create Conference</IonTitle>
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
            <IonSelectOption value="15">15 minutes</IonSelectOption>
            <IonSelectOption value="30">30 minutes</IonSelectOption>
            <IonSelectOption value="60">1 hour</IonSelectOption>
            <IonSelectOption value="90">1 hour 30 minutes</IonSelectOption>
            <IonSelectOption value="120">2 hours</IonSelectOption>
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
        <ModalCall
            isOpen={showModal}
            onAddParticipant={handleAddParticipant}
            onClose={() => setShowModal(false)}
          />
      </IonContent>
    </IonPage>
  );
};

export default CreateConference;
