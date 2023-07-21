
import React, { useState, useRef, useEffect } from 'react';
import {
  IonToolbar,
  IonContent,
  IonPage,
  IonButtons,
  IonTitle,
  IonMenuButton,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonRefresher,
  IonRefresherContent,
  IonToast,
  IonModal,
  IonHeader,
  getConfig,
} from '@ionic/react';
import { arrowBack, arrowForward, search } from 'ionicons/icons';

import './SchedulePage.scss';

import ShareSocialFab from '../components/NewFabBtn';
import { call } from 'ionicons/icons';
import * as selectors from '../data/selectors';
import { connect } from '../data/connect';
import { setSearchText } from '../data/sessions/sessions.actions';
import { Schedule } from '../models/Schedule';
import DashboardContents from './DashboardContents';
import { useHistory, useLocation } from 'react-router';

interface OwnProps {}

interface StateProps {
  schedule: Schedule;
  favoritesSchedule: Schedule;
  mode: 'ios' | 'md';
}

interface DispatchProps {
  setSearchText: typeof setSearchText;
}

type SchedulePageProps = OwnProps & StateProps & DispatchProps;

const SchedulePage: React.FC<SchedulePageProps> = ({
  favoritesSchedule,
  schedule,
  setSearchText,
  mode,
}) => {
  const [showSearchbar, setShowSearchbar] = useState<boolean>(false);
  const [viewHistory, setViewHistory] = useState<boolean>(false);
  const [searchSubject, setSearchSubject] = useState<string>('');
  const ionRefresherRef = useRef<HTMLIonRefresherElement>(null);

  const history = useHistory();

  const handleFabClick = () => {
    history.push('/instant-conf');
  };

  const handleViewHistory = () => {
    setSearchSubject('');
    setViewHistory(true);
  };

  const handleBackToDashboard = () => {
    setSearchSubject('');
    setViewHistory(false);
  };

  const doRefresh = (event) => {
    // Perform your refresh logic here
    
    setTimeout(() => {
      event.detail.complete(); // Mark the refresh as complete
    }, 2000); // Replace with your actual refresh logic
  };

  const pageRef = useRef<HTMLElement>(null);

  const ios = mode === 'ios';

  return (
    <IonPage ref={pageRef} id="schedule-page">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>Dashboard</IonTitle>
          {!showSearchbar && (
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
          )}
          <IonButtons slot="end">
            {!ios && !showSearchbar && (
              <IonButton onClick={() => setShowSearchbar(true)}>
                <IonIcon slot="icon-only" icon={search}></IonIcon>
              </IonButton>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Dashboard</IonTitle>
          </IonToolbar>
          <IonToolbar>
            <IonSearchbar
              placeholder="Search"
              onIonInput={(e: CustomEvent) => setSearchSubject(e.detail.value)}
            ></IonSearchbar>
          </IonToolbar>
        </IonHeader>
        <IonToolbar className="ion-no-padding">
          {viewHistory ? (
            <IonButtons
              className="view-history-btn"
              slot="end"
              onClick={handleBackToDashboard}
            >
              <IonIcon icon={arrowBack} />
              Back to Dashboard
            </IonButtons>
          ) : (
            <IonButtons
              className="view-history-btn"
              slot="end"
              onClick={handleViewHistory}
            >
              View Conference History
              <IonIcon icon={arrowForward} />
            </IonButtons>
          )}
        </IonToolbar>
        <DashboardContents
          viewHistory={viewHistory}
          searchSubject={searchSubject}
        />
      </IonContent>
      <ShareSocialFab label="New" icon={call} onClick={handleFabClick} />
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    schedule: selectors.getSearchedSchedule(state),
    favoritesSchedule: selectors.getGroupedFavorites(state),
    mode: getConfig()!.get('mode'),
  }),
  mapDispatchToProps: {
    setSearchText,
  },
  component: React.memo(SchedulePage),
});
