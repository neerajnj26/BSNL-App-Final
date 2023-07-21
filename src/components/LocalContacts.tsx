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
} from '@ionic/react';

import API from '../api/API.js'
import { person } from 'ionicons/icons';

const LocalContacts: React.FC = () => {

  const [contacts, setContacts] = useState([])

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
        setContacts(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <IonContent scrollEvents={true}>
      <IonList>
        <IonListHeader style={{backgroundColor: '#d9d9d9', borderRadius: '5px', position:'relative', left:'2%', width: '95%'}}>
          <IonText 
          className='ion-padding'
          style={{fontSize: '1.2rem', paddingLeft:'0'}}
          >Local Contacts</IonText>
        </IonListHeader>
        {contacts.map((contact, index) => (
          <IonItem style={{
            paddingTop: '0',
            paddingBottom: '0'
            }} 
            key={index}>
            <IonIcon slot='start' icon={person} />
            <IonLabel>
              <IonCardSubtitle style={{fontSize: '1rem'}}>
                {contact.entry[1].value}
              </IonCardSubtitle>
              <p>{contact.entry[2].value}</p>
            </IonLabel>
          </IonItem>
        ))}
      </IonList>
    </IonContent>
  );
};
export default LocalContacts;
