const URL = "http://35.154.233.185:8000";

class API {
  static ConferenceInfo(token, conID, subconfID) {
    const url = `${URL}/user/queryconferenceinfo`;

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: `${token}`,
        conferenceID: `${conID}`,
        SubconferenceID: `${subconfID}`,
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static ConferenceTemplateList(token) {
    const url = `${URL}/user/templatelist`;

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: `${token}`,
        resultFields: ["Parties", "Length", "TemplateID"],
        isAscend: false,
        pageIndex: 0,
        pageSize: 50,
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static createconference(
    token,
    length,
    size,
    timeZone,
    language,
    subject,
    startTime,
    autoInvite,
    attendees
  ) {
    const url = `${URL}/user/createconference`;

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: `${token}`,
        length: `${length}`,
        size: `${size}`,
        timeZone: `${timeZone}`,
        language: `${language}`,
        subject: `${subject}`,
        startTime: `${startTime}`,
        mediaTypes: `Voice`,
        autoInvite: autoInvite,
        attendees: attendees,
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static createconferencetemplate(
    token,
    templateId,
    length,
    size,
    timeZone,
    language,
    templateName
  ) {
    const url = `${URL}/user/createconferencetemplate`;

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: `${token}`,
        templateID: `${templateId}`,
        length: `${length}`,
        size: `${size}`,
        timeZone: `${timeZone}`,
        language: `${language}`,
        templateName: `${templateName}`,
        mediaTypes: `Voice`,
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static EndConference(token, conferenceID) {
    const url = `${URL}/user/endconference`;

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: `${token}`,
        conferenceID: `${conferenceID}`,
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static InviteParticipants(token, conID, body) {
    const url = `${URL}/user/inviteparticipants`;

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: `${token}`,
        conferenceID: `${conID}`,
        invitePara: body,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  }

  static LeaveParticipant(token, conferenceID, participantID) {
    const url = `${URL}/user/leaveconference`;

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: `${token}`,
        conferenceID: `${conferenceID}`,
        participantID: `${participantID}`,
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static Login(accountName, password, accountType) {
    const url = `${URL}/user/login`;

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: `${accountName}`,
        password: `${password}`,
        accountType: `${accountType}`,
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static Logout(token) {
    const url = `${URL}/user/logout`;

    return fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: `${token}`,
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static modifyuserpassword(
    token,
    account,
    oldPassWord,
    newPassWord,
    newPassWordAffirm
  ) {
    const url = `${URL}/user/modifyuserpassword`;

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: `${token}`,
        account: account,
        oldPassWord: `${oldPassWord}`,
        newPassWord: `${newPassWord}`,
        newPassWordAffirm: `${newPassWordAffirm}`,
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static MuteConference(token, conferenceID, mute) {
    const url = `${URL}/user/mute`;

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: `${token}`,
        conferenceID: `${conferenceID}`,
        isAllMute: `${mute}`,
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static queryConferencehistory(token, pageIndex) {
    const url = `${URL}/user/conferencelist`;

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: `${token}`,
        filter: {
          resultFields: [
            "StartTime",
            "Subject",
            "ConferenceID",
            "SubConferenceID",
            "ConferenceState",
            "Length",
            "TimeZone",
            "ScheduserName",
            "mediaTypes",
            "accessNumber",
            "factEndTime",
            "accountID",
            "totalSize",
          ],
          conditions: {
            key: "ConferenceState",
            value: "Destroyed",
            matching: "equal",
          },
          isAscend: "False",
          pageIndex: pageIndex,
          pageSize: 10,
        },
        isIncludeInvitedConference: "True",
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static queryConferenceList(token) {
    const url = `${URL}/user/conferencelist`;

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: `${token}`,
        filter: {
          resultFields: [
            "StartTime",
            "Subject",
            "ConferenceID",
            "SubConferenceID",
            "ConferenceState",
            "Length",
            "TimeZone",
            "ScheduserName",
            "mediaTypes",
            "accessNumber",
            "factEndTime",
            "accountID",
            "totalSize",
          ],
          conditions: {
            key: "ConferenceState",
            value: "Destroyed",
            matching: "unequal",
          },
          isAscend: "False",
          pageIndex: 0,
          pageSize: 10,
        },
        isIncludeInvitedConference: "True",
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static RemoveConference(token, conferenceID, subconferenceID) {
    const url = `${URL}/user/deleteconference`;

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: `${token}`,
        conferenceID: `${conferenceID}`,
        subconferenceID: `${subconferenceID}`,
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static ModifyConference(
    token,
    conferenceID,
    SubconferenceID,
    length,
    size,
    timeZone,
    language,
    subject,
    startTime,
    attendees
  ) {
    const url = `${URL}/user/modifyconference`;

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: `${token}`,
        conferenceID: `${conferenceID}`,
        subconferenceID: `${SubconferenceID}`,
        length: `${length}`,
        size: `${size}`,
        timeZone: `${timeZone}`,
        language: `${language}`,
        subject: `${subject}`,
        startTime: `${startTime}`,
        mediaTypes: `Voice`,
        attendees: attendees,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  }

  static OnlineConferenceInfo(token, conID, subconfID) {
    const url = `${URL}/user/queryonlineconferenceinfo`;

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: `${token}`,
        conferenceID: `${conID}`,
        SubconferenceID: `${subconfID}`,
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static deleteconferencetemplate(
    token,
    templateId
  ) {
    const url = `${URL}/user/deleteconferencetemplate`;

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: `${token}`,
        templateID: `${templateId}`
      }),
    })
      .then((response) => response.json())
      .then((data) => {console.log(data)});
  }

}

export default API;