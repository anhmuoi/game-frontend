import React from 'react';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';

import { MasterPage } from '../index';
import WebSocketMqtt from '../../../utils/mqtt';

describe('<MasterPage />', () => {
  const enqueueSnackbar = jest.fn();
  const location = fromJS({ pathname: '/' });
  // setup
  let webMqttClient;
  let pahoClient;
  const subscribe = jest.fn();
  const unsubscribe = jest.fn();
  const connect = jest.fn();
  const isConnected = jest.fn(() => true);

  let wrapper;
  beforeEach(() => {
    jest.clearAllMocks();
    pahoClient = { subscribe, unsubscribe, connect, isConnected };
    webMqttClient = new WebSocketMqtt();
    webMqttClient.setClientMQTT(pahoClient);
    webMqttClient.setTopics(['init_topic']);
    window.DeMaster_Mqtt_Client = webMqttClient;

    wrapper = shallow(
      <MasterPage location={location} enqueueSnackbar={enqueueSnackbar} />,
    );
  });

  it('should contains Helmet', () => {
    expect(wrapper.find('Helmet')).toBeDefined();
  });

  it('should not exsit window.DeMaster_Mqtt_Client when first mont', () => {
    expect(window.DeMaster_Mqtt_Client).toBeDefined();
  });

  it('should call enqueueSnackbar when recive mqtt message with type NOTIFICATION', () => {
    const message = {
      payloadString: JSON.stringify({
        type: 'NOTIFICATION',
        data: { message: 'message', message_type: 'infor' },
      }),
    };
    wrapper.instance().handleReciveMessageMqtt(message);

    expect(enqueueSnackbar).toBeCalled();
  });

  it('should call connect of mqtt client', () => {
    const success = (context, topicsIsSubscribed) =>
      context.subscribeTopics(topicsIsSubscribed);
    const fail = jest.fn();
    webMqttClient.connect(
      success,
      fail,
    );

    success(webMqttClient, webMqttClient.info().topicsIsSubscribed);
    expect(subscribe).toBeCalled();
    expect(connect).toBeCalled();
  });
});
