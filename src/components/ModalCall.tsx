import React, { useState } from 'react';
import {
  IonModal,
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';

import API from '../api/API.js'

interface ModalCallProps {
  isOpen: boolean;
  onAddParticipant: (name: string, phoneNumber: string) => void;
  conferenceID: string;
  onClose: () => void;
}

const ModalCall: React.FC<ModalCallProps> = ({
  isOpen,
  conferenceID,
  onAddParticipant,
  onClose,
}) => {

  const [name, setName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [smsPhoneNumber, setSmsPhoneNumber] = useState<string>(null);
  const [emailId, setEmailId] = useState<string>('');
  
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

  var cred = localStorage.getItem('cred')
  const handleAddParticipant = () => {
    // onAddParticipant(name, phoneNumber,smsPhoneNumber,emailId);
    API.InviteParticipants(cred, conferenceID, [{
      name: name,
      phone: phoneNumber,
      role: 'general',
      isMute: false
    }] )
    .then((res) => {
      console.log(res);})
    .catch((err) => {
        console.log(err);
        alert("Something went wrong. Please try again.");
      })

      setName('');
      setPhoneNumber(null);
      setSmsPhoneNumber(null);
      setEmailId('');
      onClose();
  };

  const inputStyles = {
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    textIndent: '12px',
  };

  return (
    <IonModal isOpen={isOpen}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add Participant</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <IonItem>
          <IonLabel position="stacked"><b>Name</b></IonLabel>
          <IonInput
            style={inputStyles}
            type="text"
            value={name}
            onIonInput={(e) => setName(e.detail.value! as string)}
          ></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked"><b>Phone Number</b></IonLabel>
          <IonInput
            style={inputStyles}
            type='text'
            value={phoneNumber}
            onIonInput={(e) => setPhoneNumber(e.detail.value! as string)}
          ></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked"><b>SMS Phone Number</b></IonLabel>
          <IonInput
            style={inputStyles}
            type="text"
            value={smsPhoneNumber}
            onIonInput={(e) => setSmsPhoneNumber(e.detail.value! as string)}
          ></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked"><b>Email Id</b></IonLabel>
          <IonInput
            style={inputStyles}
            type="email"
            value={emailId}
            onIonInput={(e) => setEmailId(e.detail.value! as string)}
          ></IonInput>
        </IonItem>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonButton expand="block" onClick={handleAddParticipant}>
                Add Participant
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton expand="block" color="danger" onClick={onClose}>
                Close
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonModal>
  );
};

export default ModalCall;
