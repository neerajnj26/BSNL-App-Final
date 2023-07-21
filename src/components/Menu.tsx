import React, { useState } from 'react';
import { RouteComponentProps, withRouter, useHistory, useLocation } from 'react-router';

import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonToggle,
} from '@ionic/react';
import {
  create,
  calendarOutline,
  hammer,
  moonOutline,
  help,
  informationCircleOutline,
  logIn,
  logOut,
  mapOutline,
  peopleOutline,
  person,
  personAdd,
  call,
  settings,
} from 'ionicons/icons';

import { connect } from '../data/connect';
import './Menu.css';

import API from '../api/API.js'

const routes = {
  appPages: [
    { title: 'Dashboard', path: '/tabs/schedule', icon: calendarOutline },
    { title: 'Create Conference', path: '/tabs/createconf', icon: call },
    { title: 'Contacts', path: '/tabs/speakers', icon: peopleOutline },
    { title: 'Templates', path: '/tabs/templates', icon: create },
    { title: 'About', path: '/tabs/about', icon: informationCircleOutline },
  ],
  loggedInPages: [
    { title: 'Settings', path: '/settings', icon: settings },
    { title: 'Support', path: '/support', icon: help },
    { title: 'Logout', path: '/logout', icon: logOut }
  ],
};

interface Pages {
  title: string;
  path: string;
  icon: string;
  routerDirection?: string;
}
interface StateProps {
  isAuthenticated: boolean;
  menuEnabled: boolean;
}

interface MenuProps extends RouteComponentProps, StateProps {}

const Menu: React.FC<MenuProps> = ({
  isAuthenticated,
  menuEnabled,
}) => {

  const history = useHistory()
  const location = useLocation()

  const handleLogout = () => { 

    console.log(document.cookie);
      function getCookie(cookieName) {
        const cookieString = document.cookie;
        const cookies = cookieString.split(":");
  
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.startsWith(cookieName + "=")) {
            return cookie.substring(cookieName.length + 1);
          }
        }
  
        return null;
      }
      const token = getCookie("user");
      API.Logout(token)
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
      function clearAllCookies() {
        var cookies = document.cookie.split(":");
  
        for (var i = 0; i < cookies.length; i++) {
          var cookie = cookies[i];
          var eqPos = cookie.indexOf("=");
          var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie =
            name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        }
      }
      clearAllCookies();
      history.push("/");
  }
  

  function renderlistItems(list: Pages[]) {
    return list
      .filter((route) => !!route.path)
      .map((p) => {
        if (p.title === 'Logout') {
          return (
            <IonMenuToggle key={p.title} auto-hide="false">
              <IonItem
                detail={false}
                onClick={handleLogout}
                routerDirection="root"
                className={location.pathname.startsWith(p.path) ? 'selected' : undefined}
              >
                <IonIcon color='danger' slot="start" icon={p.icon} />
                <IonLabel color='danger'>{p.title}</IonLabel>
              </IonItem>
            </IonMenuToggle>
          );
        } else {
          return (
            <IonMenuToggle key={p.title} auto-hide="false">
              <IonItem
                detail={false}
                routerLink={p.path}
                routerDirection="none"
                className={location.pathname.startsWith(p.path) ? 'selected' : undefined}
              >
                <IonIcon slot="start" icon={p.icon} />
                <IonLabel>{p.title}</IonLabel>
              </IonItem>
            </IonMenuToggle>
          );
        }
      });
  }

  return (
    <IonMenu type="overlay" disabled={!menuEnabled} contentId="main">
      <IonContent forceOverscroll={false}>
        <IonList lines="none">
          <IonListHeader>Conference</IonListHeader>
          {renderlistItems(routes.appPages)}
        </IonList>
        <IonList lines="none">
          <IonListHeader>Account</IonListHeader>
          {renderlistItems(routes.loggedInPages)}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default connect<{}, StateProps, {}>({
  mapStateToProps: (state) => ({
    darkMode: state.user.darkMode,
    isAuthenticated: state.user.isLoggedin,
    menuEnabled: state.data.menuEnabled,
  }),
  component: withRouter(Menu),
});
