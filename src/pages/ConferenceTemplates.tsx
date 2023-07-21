import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonRefresher,
  IonRefresherContent,
  IonMenuButton,
  IonPage,
  IonRow,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import ShareSocialFab from '../components/NewFabBtn';
import CreateTempWindow from './CreateTempWindow';
import API from '../api/API.js';
import { addCircle } from 'ionicons/icons';
import './ConferenceTemplates.scss';
import { useHistory } from 'react-router';

const ConferenceTemplates: React.FC = () => {
  const [templates, setTemplates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getCookie = (cookieName: any) => {
    const cookieString = document.cookie;
    const cookies = cookieString.split(':');

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(cookieName + '=')) {
        return cookie.substring(cookieName.length + 1);
      }
    }

    return null; // Return null if the cookie is not found
  };

  useEffect(() => {
    const token = getCookie('user');
    API.ConferenceTemplateList(token)
      .then((res: any) => {
        const templateArray = Object.values(res)
          .filter((value) => typeof value === 'object')
          .map((template) => template);
        console.log(templateArray);
        setTemplates(templateArray);
      })
      .catch((err: any) => {
        console.log(
          'Could not fetch template details. Please try again later.'
        );
      });
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCancelModal = () => {
    setShowModal(false);
  };

  const doRefresh = (event) => {
    setTimeout(() => {
      event.detail.complete(); 
    }, 2000); 
  };

  const history = useHistory();

  const handleStartClick = (temp: any) => {
      const durationInMinutes = parseInt(temp.Length, 10)
      const durationInMilliSeconds = durationInMinutes * 60 * 1000;
      
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
        temp.Parties,
        48,
        "en_US",
        temp.TemplateName,
        0,
        false, 
      )

      .then((res) => {
        console.log(res);
      }).catch((err)=>{
        console.log(err)
      })

      history.replace('/schedule-confirmation');
  }

  const handleScheduleClick = (temp: any) => {
    history.push('/schedule-conf', {temp})
  }

  const filteredTemplates = templates.filter((temp) =>
    temp.TemplateName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Templates</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Templates</IonTitle>
          </IonToolbar>
          <IonToolbar>
            <IonSearchbar
              showCancelButton="never"
              placeholder="Search"
              value={searchQuery}
              onIonChange={(e) => setSearchQuery(e.detail.value)}
            ></IonSearchbar>
          </IonToolbar>
        </IonHeader>
        {filteredTemplates.map((temp) => (
          <IonCard key={temp.TemplateId} className="template-card">
            <IonCardHeader style={{ paddingBottom: '0' }}>
              <IonCardTitle style={{ fontSize: '1.3rem' }}>
                {temp.TemplateName}
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="ion-no-padding ion-padding-bottom">
              <IonGrid className="template-grid">
                <IonRow>
                  <IonCol size="7">Duration:</IonCol>
                  <IonCol size="5">{temp.Length} minutes</IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="7">Number of participants:</IonCol>
                  <IonCol size="5">{temp.Parties}</IonCol>
                </IonRow>
                <br />
                <IonRow>
                  <IonCol>
                    <IonButton color="primary" expand="block" onClick={() => handleStartClick(temp)}>
                      Start Now
                    </IonButton>
                  </IonCol>
                  <IonCol>
                    <IonButton color="success" expand="block" onClick={() => handleScheduleClick(temp)}>
                      Schedule
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>
        ))}
        <ShareSocialFab
          label="Create"
          icon={addCircle}
          onClick={handleOpenModal}
        />
        <CreateTempWindow
          isOpen={showModal}
          onCancel={handleCancelModal}
        />
      </IonContent>
    </IonPage>
  );
};

export default ConferenceTemplates;
