import React, { useEffect, useRef, useState } from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
  IonButtons,
  IonMenuButton,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonGrid,
  IonCol,
  IonRow,
  IonIcon,
} from '@ionic/react';

import API from '../api/API.js'
import './SpeakerList.scss';
import LocalContacts from '../components/LocalContacts.js';
import { download } from 'ionicons/icons';

const SpeakerList: React.FC = () => {
  const [jsonData, setJsonData] = useState<any[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const data = event.target?.result;
        if (data instanceof ArrayBuffer) {
          // Dynamically import xlsx
          const XLSX = await import('xlsx');
          const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          setJsonData(json)
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <IonPage id="speaker-list">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Contacts</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen={true}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Contacts</IonTitle>
          </IonToolbar>
        </IonHeader>
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          onInput={handleFileChange}
        />
        <IonGrid>
          <IonRow>
            <IonCol size='5'>
              <IonButton className='ion-no-margin' expand='block'>Add Contacts</IonButton>
            </IonCol>
            <IonCol size='5'>
              <IonButton className='ion-no-margin' expand='block' fill='outline'>Add Groups</IonButton>
            </IonCol>
            <IonCol size='2'>
              <IonIcon 
                className='ion-no-margin' 
                icon={download}   
                color='primary'
                style={{
                  fontSize:'2.5rem',
                }}
                onClick={handleImportClick} />
            </IonCol>
          </IonRow>
        </IonGrid>
        <LocalContacts />
        <IonList className='ion-margin'>
        {jsonData.length > 0 && (
              <IonItem>
                <IonLabel style={{ fontWeight: 'bolder' }}>
                  {jsonData[0][0]}
                </IonLabel>
                <IonLabel style={{ fontWeight: 'bolder' }}>
                  {jsonData[0][2]}
                </IonLabel>
                {/* Add more IonLabels for other columns */}
              </IonItem>
            )}
          {jsonData?.slice(1).map((data, index) => (
            <IonItem key={index}>
              <IonLabel>{data[0]}</IonLabel>
              <IonLabel>{data[2]}</IonLabel>
              {/* Add more IonLabels for other columns */}
            </IonItem>
          ))}
        </IonList>

      </IonContent>
    </IonPage>
  );
};

export default SpeakerList;