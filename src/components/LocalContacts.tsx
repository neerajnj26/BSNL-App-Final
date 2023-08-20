import React, { useEffect, useState } from 'react';
import {
  IonList,
  IonItem,
  IonLabel,
  IonListHeader,
  IonContent,
  IonCardSubtitle,
  IonIcon,
  IonText,
  IonButton,
} from '@ionic/react';

import API from '../api/API.js';
import { person, caretDown, caretUp } from 'ionicons/icons';

const LocalContacts: React.FC = () => {
  const [contacts, setContacts] = useState([]);
  const [showUngroupedContacts, setShowUngroupedContacts] = useState(false);
  const [showGroupedContacts, setShowGroupedContacts] = useState(false);

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

  useEffect(() => {
    API.querycontactorlist(token, 1)
      .then((res) => {
        setContacts(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const toggleUngroupedContacts = () => {
    setShowUngroupedContacts(!showUngroupedContacts);
  };

  const toggleGroupedContacts = () => {
    setShowGroupedContacts(!showGroupedContacts);
  };

  return (
    <IonContent scrollEvents={true}>
      <IonList>
        <div className='ungrouped-list'>
          <IonListHeader
            style={{
              backgroundColor: '#eeeded',
              borderRadius: '5px',
              position: 'relative',
              left: '2%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #ccc',
              cursor: 'pointer',
              width:'95%'
            }}
            onClick={toggleUngroupedContacts}
          >
            <IonText className='ion-padding' style={{ fontSize: '1.2rem', paddingLeft: '0' }}>
              Ungrouped Contacts
            </IonText>
            <IonIcon icon={showUngroupedContacts ? caretUp : caretDown} />
          </IonListHeader>
          <div style={{ display: showUngroupedContacts ? 'block' : 'none' }}>
            {contacts.map((contact, index) => (
              <IonItem
                style={{
                  paddingTop: '0',
                  paddingBottom: '0',
                }}
                key={index}
              >
                <IonIcon slot='start' icon={person} style={{ fontSize: '1.2rem' }} />
                <IonLabel>
                  <IonCardSubtitle style={{ fontSize: '0.85rem' }}>{contact.entry[1].value}</IonCardSubtitle>
                  <p>{contact.entry[2].value}</p>
                </IonLabel>
              </IonItem>
            ))}
          </div>
        </div>
        <div className='grouped-list'>
        <IonListHeader
            style={{
              backgroundColor: '#eeeded',
              borderRadius: '5px',
              position: 'relative',
              left: '2%',
              display: 'flex',
              justifyContent: 'space-between',
              marginTop:'10px',
              alignItems: 'center',
              borderBottom: '1px solid #ccc',
              cursor: 'pointer',
              width:'95%'
            }}
            onClick={toggleGroupedContacts}
          >
            <IonText className='ion-padding' style={{ fontSize: '1.2rem', paddingLeft: '0' }}>
              Grouped Contacts
            </IonText>
            <IonIcon icon={showGroupedContacts ? caretUp : caretDown} />
          </IonListHeader>
          <div style={{ display: showGroupedContacts ? 'block' : 'none' }}>
            
          </div>
        </div>
      </IonList>
    </IonContent>
  );
};

export default LocalContacts;
