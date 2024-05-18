import Paho from 'paho-mqtt';
import { localstoreUtilites } from './persistenceData';

// // for UT testing not read config from window
// const envVariable = window && window.env ? window.env : {};

// const configWS = {
//   wsbroker: envVariable.RABBITMQ_URL,
//   wsport: envVariable.RABBITMQ_PORT,
//   clientKey: `demasterpro_${Math.random() * 10}`,
//   userName: envVariable.RABBITMQ_USERNAME,
//   password: envVariable.RABBITMQ_PASS,
// };

/**
 * @param {*} successCallback: function
 * @param {*} failCallback: function
 */
const configOption = (successCallback, failCallback) => {
  const configWS = localstoreUtilites.getConfigWSFromLocalStorage();
  const options = {
    userName: configWS.userName,
    password: configWS.password,
    timeout: 30,
    reconnect: true, // Enable automatic reconnect
    onSuccess() {
      successCallback();
    },
    onFailure(message) {
      failCallback(message.errorMessage);
    },
  };

  if (
    window.location.protocol === 'https:' ||
    window.env.API_URL.startsWith('https')
  ) {
    options.useSSL = true;
  }

  return options;
};

const configOptionClient = (successCallback, failCallback) => {
  const configWS = localstoreUtilites.getConfigWSClientFromLocalStorage();
  const options = {
    userName: configWS.userName,
    password: configWS.password,
    timeout: 30,
    reconnect: true, // Enable automatic reconnect
    onSuccess() {
      successCallback();
    },
    onFailure(message) {
      failCallback(message.errorMessage);
    },
  };

  if (
    window.location.protocol === 'https:' ||
    window.env.API_URL.startsWith('https')
  ) {
    options.useSSL = true;
  }

  return options;
};

function WebSocketMqtt() {
  let clientMQTT = null; // init MQTT client
  const reciveMessageHandlers = []; // array of functions
  let connectLostHandler = null;
  let topicsIsSubscribed = [];

  /**
   * **This methods only for testing**
   * @param(obj : object) for init clientMQTT
   */
  this.setClientMQTT = obj => {
    clientMQTT = obj;
  };

  this.info = () => ({
    reciveMessageHandlers,
    connectLostHandler,
    topicsIsSubscribed,
  });

  /**
   * **End**
   */

  /**
   * singleton
   * if client is not initialized create new one,
   * othewise get instance is initialized before
   */
  this.init = () => {
    const configWS = localstoreUtilites.getConfigWSFromLocalStorage();
    const username = localstoreUtilites.getUsernameFromLocalStorage();
    const companyCode = localstoreUtilites.getCompanycodeFromLocalStorage();

    if (!clientMQTT) {
      // setup global
      window.Paho = { MQTT: { Client: Paho.Client, Message: Paho.Message } };
      const { host, port } = configWS;
      clientMQTT = new window.Paho.MQTT.Client(
        host,
        parseInt(port, 10),
        '/ws',
        `demasterpro_${username}_${companyCode}_${new Date().toISOString()}`,
      );
    }

    return this;
  };

  this.initClient = () => {
    const configWS = localstoreUtilites.getConfigWSClientFromLocalStorage();
    const username = localstoreUtilites.getUsernameClientFromLocalStorage();
    const companyCode = localstoreUtilites.getCompanyCodeClientFromLocalStorage();

    if (!clientMQTT) {
      // setup global
      window.Paho = { MQTT: { Client: Paho.Client, Message: Paho.Message } };
      const { host, port } = configWS;
      clientMQTT = new window.Paho.MQTT.Client(
        host,
        parseInt(port, 10),
        '/ws',
        `demasterpro_${username}_${companyCode}_${new Date().toISOString()}`,
      );
    }

    return this;
  };

  /**
   * @param(callback) function: handler when connection is lost
   *
   * @return this: MQTT client for chaining methods
   */
  this.onConnectLost = callback => {
    if (clientMQTT.isConnected()) {
      connectLostHandler = callback;
      clientMQTT.onConnectionLost = response => {
        if (connectLostHandler) {
          connectLostHandler(response);
        }
      };
    }

    return this;
  };

  /**
   * clear handler for connection lost
   * only Monitor page
   */
  this.removeConnectLostHandler = () => {
    connectLostHandler = null;
    return this;
  };

  /**
   * @param(handler) function: function is added to array handler
   * when Mqtt client recive message all of this function will be called
   *
   * @return this: for chaning method
   */
  this.addReciveMessageHandler = handler => {
    reciveMessageHandlers.push(handler);
    return this;
  };

  /**
   * @param(handler) function: function is removed to array handler
   * when Mqtt client recive message all of this function will not be called
   *
   * @return this: for chaning method
   */
  this.removeReciveMessageHandler = () => {
    reciveMessageHandlers.pop();
    return this;
  };
  /**
   * @param(callback) function: handler when messeage is recived
   *
   * @return this: MQTT client for chaining methods
   */
  this.onReciveMessage = () => {
    clientMQTT.onMessageArrived = message => {
      reciveMessageHandlers.forEach(callback => {
        callback(message);
      });
    };

    return this;
  };

  /**
   * @param(topics) array string: topic subscribe
   *
   * if state is connected, client MQTT will subscribe all of topic pass into
   */
  this.subscribeTopics = topics => {
    if (topics.length !== 0) {
      topicsIsSubscribed = topicsIsSubscribed.concat(
        topics.filter(topic => topicsIsSubscribed.indexOf(topic) === -1),
      );
      if (clientMQTT.isConnected()) {
        topics.forEach(topic => {
          clientMQTT.subscribe(topic, {
            qos: 1,
          });
        });
      }
    }

    return this;
  };

  /**
   * @param(topics) array string: topic will be unSubscribed
   *
   * if state is connected, client MQTT will unSubscribe all of topic pass into
   */
  this.unSubscribe = topics => {
    if (clientMQTT.isConnected()) {
      topicsIsSubscribed = topicsIsSubscribed.filter(
        topic => topics.indexOf(topic) === -1,
      );
      topics.forEach(topic => {
        clientMQTT.unsubscribe(topic, {
          onSuccess: () => {
            // handler for unsubscribe success
          },
          onFailure: () => {
            // handler for unsubscribe fail
          },
        });
      });
    }

    return this;
  };

  /**
   * @param(topics: array) topics for subcriber init
   */
  this.setTopics = topics => {
    topicsIsSubscribed = topics;
    return this;
  };

  const self = this;
  /**
   * connect from Paho with options
   * @param(success) function: handler is called when connect success
   * @param(fail) function: handler is call when fail connect happend
   *
   * @returns(this) for chaining method
   */
  this.connect = (success, fail) => {
    try {
      clientMQTT.connect(
        configOption(() => success(self, topicsIsSubscribed), fail),
      ).disconnectedPublishing = true;
    } catch (e) {
      return this;
    }
    return this;
  };

  this.connectClient = (success, fail) => {
    try {
      clientMQTT.connect(
        configOptionClient(() => success(self, topicsIsSubscribed), fail),
      ).disconnectedPublishing = true;
    } catch (e) {
      return this;
    }
    return this;
  };

  /**
   * publish message to queue with topic
   * @param(topic) string: topic recieve message
   * @param(message) object: object contain info of message
   */
  this.publish = (topic, message) => {
    const messageObj = new Paho.Message(JSON.stringify(message));
    messageObj.destinationName = topic;
    clientMQTT.send(messageObj);
    return this;
  };
}

export default WebSocketMqtt;
