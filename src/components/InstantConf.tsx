import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonSearchbar,
  IonIcon,
  IonLabel,
  IonButton,
  IonFab,
  IonFabButton,
  IonFabList,
  IonAlert,
} from '@ionic/react';
import {
  call,
  personAdd,
  peopleCircle,
  volumeMute,
  people,
  chevronUpCircle,
  volumeHigh,
} from 'ionicons/icons';

import ModalCall from './ModalCall';
import ContactList from './ContactList';

import './InstantConf.css'
import { useHistory, useLocation, RouteComponentProps } from 'react-router';
import API from '../api/API.js'

interface LocationState {
  meeting: any;
}

const InstantConf: React.FC<RouteComponentProps<any, any, LocationState>> = ({location}) => {
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [attendees, setAttendees] = useState([])
  const [inviteStates, setInviteStates] = useState([]);
  const [isMuteAll, setIsMuteAll] = useState(false)

  // console.log(inviteStates)
  const history = useHistory();

  const { meeting } = location.state || {};
  const username = localStorage.getItem('userID')
  let participantsDetails

  useEffect(() =>{
    let loopFunction: NodeJS.Timeout;

    if (!Array.isArray(meeting?.attendees)) {
      setAttendees(meeting?.attendees ? [meeting?.attendees] : []);
    } else {
      setAttendees(meeting?.attendees);
    }



    API.Login(meeting?.conferenceKey.conferenceID , meeting?.chair , "ConferenceID")
    .then((res) => {
      console.log("Join Response: ",res);

      if (res.message === "success") {
        localStorage.setItem('cred',res.token)
        localStorage.setItem("Conference ID:", meeting?.conferenceKey?.conferenceID)

        API.OnlineConferenceInfo(
          res.token,
          meeting?.conferenceKey?.conferenceID,
          0
        )
          .then((confInfoRes) => {
            // Process the conference info response here
            console.log("Conference Info: ", confInfoRes);
      
            const conferenceDetails =
              confInfoRes?.spellQueryconference?.conference;
            let inviteState = conferenceDetails?.inviteStates?.inviteState;
            if(Array.isArray(inviteState)){
            setInviteStates(inviteState);
            }
             participantsDetails = conferenceDetails?.participants
              ? conferenceDetails?.participants?.participant
              : [];
            console.log("Invite states: ", inviteState);
            console.log("Participants details: ", participantsDetails);

            if(!Array.isArray(inviteState)) {
              setInviteStates(inviteState ? [inviteState] : []);
            }
      
            if (!Array.isArray(participantsDetails)) {
              participantsDetails = participantsDetails
                ? [participantsDetails]
                : [];
            }
      
            inviteState?.forEach((invite) => {
              if (invite.state === "200") {
                participantsDetails?.forEach((participantDetail) => {
                  if (
                    invite?.phone ===
                    participantDetail?.subscribers?.subscriber?.subscriberID
                  ) {
                    setAttendees((prevParticipants) =>
                      prevParticipants?.reduce((acc, participant) => {
                        if (
                          participant?.addressEntry[0]?.address === invite?.phone &&
                          !participant?.participantID
                        ) {
                          return [
                            ...acc,
                            {
                              ...participant,
                              participantID:
                                participantDetail?.subscribers?.subscriber?.callID,
                            },
                          ];
                        }
                        return [...acc, participant];
                      }, [])
                    );
                  }
                });
              } else {
                setAttendees((prevParticipants) =>
                  prevParticipants.map((participant) => ({
                    ...participant,
                    participantID: undefined,
                  }))
                );
              }
            });
          })
          .catch((err) => {
            console.log(err);
            // Handle errors here
          })

          // Start the loop function after successful login
            loopFunction = setInterval(() => {
            API.OnlineConferenceInfo(
              res.token,
              meeting?.conferenceKey?.conferenceID,
              0
            )
              .then((confInfoRes) => {
                // Process the conference info response here
                console.log("Conference Info: ", confInfoRes);
          
                const conferenceDetails =
                  confInfoRes?.spellQueryconference?.conference;
                let inviteState = conferenceDetails?.inviteStates?.inviteState;
                if(Array.isArray(inviteState)){
                setInviteStates(inviteState);
                }
                let participantsDetails = conferenceDetails?.participants
                  ? conferenceDetails?.participants?.participant
                  : [];
                console.log("Invite states: ", inviteState);
                console.log("Participants details: ", participantsDetails);

                if(!Array.isArray(inviteState)) {
                  setInviteStates(inviteState ? [inviteState] : []);
                }
          
                if (!Array.isArray(participantsDetails)) {
                  participantsDetails = participantsDetails
                    ? [participantsDetails]
                    : [];
                }

                if(!Array.isArray(inviteState)){
                  inviteState = inviteState? [inviteState] : []
                }
          
                inviteState?.forEach((invite) => {
                  if (invite.state === "200") {
                    participantsDetails?.forEach((participantDetail) => {
                      if (
                        invite?.phone ===
                        participantDetail?.subscribers?.subscriber?.subscriberID
                      ) {
                        setAttendees((prevParticipants) =>
                          prevParticipants?.reduce((acc, participant) => {
                            if (
                              participant?.addressEntry[0]?.address === invite?.phone &&
                              !participant?.participantID
                            ) {
                              return [
                                ...acc,
                                {
                                  ...participant,
                                  participantID:
                                    participantDetail?.subscribers?.subscriber?.callID,
                                },
                              ];
                            }
                            return [...acc, participant];
                          }, [])
                        );
                      }
                    });
                  } else {
                    setAttendees((prevParticipants) =>
                      prevParticipants.map((participant) => ({
                        ...participant,
                        participantID: undefined,
                      }))
                    );
                  }
                });
              })
              .catch((err) => {
                console.log(err);
                // Handle errors here
              });
          }, 5000);
          
          return () => clearInterval(loopFunction);
      } else console.log("Invalid Credentials");
    })
    .catch((err) => {
      console.log(err);
      console.log("Something went wrong. Please try again.");
    });
    return () => clearInterval(loopFunction);
  },[]); 

  const cred = localStorage.getItem('cred')
  const confID = localStorage.getItem('Conference ID:')

  const handleClose = () => {
    setShowAlert(true);
  }

  const handleConfirmClose = () => {
    setShowAlert(false);
    localStorage.setItem('cred',"")
    localStorage.setItem('Conference ID:',"")
    history.goBack();
  };

  const handleCancelClose = () => {
    setShowAlert(false);
  };

  const handleAddGroups = () => {
    console.log('click add groups')
  };

  const handleCallAbsent = () => {
    const updatedParticipants = attendees.map((participant) => ({
      ...participant,
      onCall: true,
    }));
    setAttendees(updatedParticipants);
  };

  const handleMuteAll = () => {
    const cred = localStorage.getItem("cred");
    API.MuteConference(cred, meeting?.conferenceKey?.conferenceID, true)
      .then((res) => {
        console.log("Mute all response: ", res);
      })
      .catch((err) => {
        console.log("Mute all error: ", err);
        alert("Error in muting all participants");
      });

    setIsMuteAll(true);
  };

  const handleUnmuteAll = () => {
    const cred = localStorage.getItem("cred");
    API.MuteConference(cred, meeting.conferenceKey.conferenceID, false)
      .then((res) => {
        console.log("Unmute all response: ", res);
      })
      .catch((err) => {
        console.log("Unmute all error: ", err);
        alert("Error in unmuting all participants");
      });
    setIsMuteAll(false);
  }

  const handleCreateSubConf = () => {
    console.log('click createsubconf')
  };

  const handleToggleParticipantMute = (index: number) => {
    const updatedParticipants = [...attendees];
    const participant = updatedParticipants[index];
    participant.muted = !participant.muted;
    setAttendees(updatedParticipants);
  };

  const handleNone = () => {
    console.log('none')
  }

  const handleCallParticipantAbsent = (index: number) => {
    const attendee = inviteStates[index]
    API.InviteParticipants(cred, confID, [{
          name: `${attendee.name}`,
          phone: `${attendee.phone}`,
          role: 'general',
          isMute: false
    }] )
    .then((res) => {
      console.log(res);})
    .catch((err) => {
        console.log(err);
        alert("Something went wrong. Please try again.");
      })
    
    const updatedParticipants = [...attendees];
    attendee.onCall = !attendee.onCall;
    setAttendees(updatedParticipants);
  };

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="end">
              <IonButton onClick={handleClose}>Close</IonButton>
            </IonButtons>
            <IonTitle>{meeting?.subject ? meeting.subject : `${username}'s Conference`}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonSearchbar placeholder="Search" />
          <IonButton className='ion-margin' expand='block' onClick={() => setShowModal(true)}>
            <IonIcon slot="start" icon={personAdd} />
            <IonLabel>Add Participants</IonLabel>
          </IonButton>
          {/* Participant List */}
          <ContactList 
            participants={attendees} 
            onToggleParticipantMute={handleToggleParticipantMute}
            onCallAbsentParticipant= {handleCallParticipantAbsent} 
            inviteStates = {inviteStates}
          />
          {/* Fab Button */}
          <IonFab className='ion-margin' vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton className='fabicon-btn'>
            <IonIcon icon={chevronUpCircle} />
          </IonFabButton>
          <IonFabList side="top">
          <div className="fabicon-labels">
            <div className="fabicon-label">
              <span className='label'>Add Groups</span>
              <IonFabButton onClick={handleAddGroups} className='fabicon-btn'>
                <IonIcon icon={peopleCircle} />
              </IonFabButton>  
            </div>
            <div className="fabicon-label">
              <span className='label'>Call Absent</span>
              <IonFabButton onClick={handleCallAbsent} className='fabicon-btn'>
                <IonIcon icon={call} />
              </IonFabButton>
            </div>
            <div className="fabicon-label">
              <span className='label'>Mute <br />All</span>
              <IonFabButton className='fabicon-btn'>
                {isMuteAll? 
                <IonIcon icon={volumeMute} onClick={handleUnmuteAll} />:
                <IonIcon icon={volumeHigh} onClick={handleMuteAll} />
                }
              </IonFabButton>
            </div>
            <div className="fabicon-label">
              <span className='label'>Create Sub Conf</span>
              <IonFabButton onClick={handleCreateSubConf} className='fabicon-btn'>
                <IonIcon icon={people} />
              </IonFabButton>  
            </div>
          </div>
          </IonFabList>
          </IonFab>
          {/* Modal */}
          <ModalCall
            isOpen={showModal}
            onAddParticipant={handleNone}
            conferenceID = {meeting?.conferenceKey?.conferenceID}
            onClose={() => {setShowModal(false)}}
          />
          <IonAlert
          isOpen={showAlert}
          header="Confirmation"
          message="Are you sure you want to close this page?"
          buttons={[
            {
              text: 'No',
              role: 'cancel',
              handler: handleCancelClose,
            },
            {
              text: 'Yes',
              handler: handleConfirmClose,
            },
          ]}
        />
        </IonContent>
      </IonPage>
    </>
  );
};

export default InstantConf;
