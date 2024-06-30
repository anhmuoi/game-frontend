import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import MultiGameAbi from '../../utils/MultiGame.json';
import { injected } from '../../components/Header/connector.js';
import { Button } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import messages from './messages.js';
import './styles.css';
import { Icon } from '@iconify/react';
import { localstoreUtilites } from '../../utils/persistenceData.js';

let isConfirm = false;

const Arena = ({
  userListId,
  checkOwnerRoom,
  userList,
  handleCreateBattle,
  gameId,
  roomDetailDataModified,
  createGameDone,
  meetingLogsDetailSelector,
  depositDone,
  inReceiveReward,
  handleRejectCreateBattle,
  loadingCreateBattle,
  setLoadingCreateBattle,
  friendListDataSelector,
  handleAddFriend,
  userOwnerRoom,
  handleKick,
}) => {
  const {
    account,
    activate,
    deactivate,
    error,
    active,
    chainId,
  } = useWeb3React(); // Lấy địa chỉ tài khoản và thư viện Web3

  const [winnerAddress, setWinnerAddress] = useState(''); // State lưu trữ địa chỉ người chiến thắng
  const [message, setMessage] = useState(''); // State lưu trữ thông báo
  const [loadingDeposit, setLoadingDeposit] = useState(false); // State lưu trữ thông báo
  const [sendAddFriendState, setSendAddFriendState] = useState(false); // State lưu trữ thông báo

  // Hàm tạo game
  const createGame = async gameId => {
    if (!account) {
      // Nếu không có tài khoản nào được kết nối, hiển thị thông báo
      setMessage('Please connect your wallet (MetaMask)');
      return;
    }

    try {
      console.log(`${roomDetailDataModified.price.value}`);
      setLoadingCreateBattle(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        window.env.REACT_APP_CONTRACT_ADDRESS,
        MultiGameAbi,
        signer,
      );

      // const tx = await contract.createGame(
      //   gameId,
      //   ethers.utils.parseEther(roomDetailDataModified.price.value.toString()),
      // );
      // setMessage(`Transaction sent: ${tx.hash}`);
      // await tx.wait();
      setMessage(`Game created successfully!`);
      createGameDone(gameId);
    } catch (error) {
      console.log('Error creating game:', error);
      handleRejectCreateBattle(gameId);
      setMessage(`Failed to create game: ${error.message}`);
    }
  };

  // Hàm tham gia game
  const joinGame = async user => {
    if (!account) {
      setMessage('Please connect your wallet (MetaMask)');
      return;
    }

    try {
      setLoadingDeposit(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        window.env.REACT_APP_CONTRACT_ADDRESS,
        MultiGameAbi,
        signer,
      );
      // const tx = await contract.joinGame(gameId, {
      //   value: ethers.utils.parseEther(
      //     roomDetailDataModified.price.value.toString(),
      //   ),
      // });
      // setMessage(`Transaction sent: ${tx.hash}`);
      // await tx.wait();
      // console.log(gameId);
      depositDone(gameId);
      setMessage(`Joined game successfully!`);
      setLoadingDeposit(false);
    } catch (error) {
      setLoadingDeposit(false);
      console.log('Error joining game:', error);
      setMessage(`Failed to join game: ${error.message}`);
    }
  };

  const sendAddFriend = user => {
    setSendAddFriendState(true);
    setTimeout(() => {
      setSendAddFriendState(false);
    }, 1000);

    handleAddFriend(user);
  };

  useEffect(
    () => {
      console.log(chainId, isConfirm);
      if (!chainId && isConfirm) {
        const { ethereum } = window;
        (async () => {
          try {
            await ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x61' }], // Binance Smart Chain Testnet Chain ID
            });
          } catch (switchError) {
            if (switchError.code === 4902) {
              try {
                await ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: '0x61',
                      chainName: 'Binance Smart Chain Testnet',
                      nativeCurrency: {
                        name: 'TBNB',
                        symbol: 'TBNB',
                        decimals: 18,
                      },
                      rpcUrls: [
                        'https://data-seed-prebsc-2-s2.binance.org:8545',
                      ], // Binance Smart Chain Testnet RPC URL
                      blockExplorerUrls: ['https://testnet.bscscan.com'], // Binance Smart Chain Testnet Block Explorer URL
                    },
                  ],
                });
              } catch (addError) {
                console.log(addError);
              }
            }
          }
          activate(injected);
        })();
        isConfirm = false;
      }
    },
    [account, error],
  );

  useEffect(
    () => {
      if (!active && localStorage.getItem('accountStatus')) {
        activate(injected);
        console.log('a');
      }
    },
    [meetingLogsDetailSelector],
  );
  useEffect(
    () => {
      console.log(gameId, roomDetailDataModified.price.value.toString());
      if (!active && localStorage.getItem('accountStatus')) {
        activate(injected);
      } else if (checkOwnerRoom) {
        createGame(gameId);
      }
    },
    [gameId],
  );

  const userIdLocal = Number(localstoreUtilites.getUserIdFromLocalStorage());
  console.log(
    meetingLogsDetailSelector,
    roomDetailDataModified.currentMeetingLogId.value,
    loadingCreateBattle,
    userListId,
  );
  if (
    meetingLogsDetailSelector &&
    meetingLogsDetailSelector.userList.length > 0 &&
    roomDetailDataModified.currentMeetingLogId.value !== 0 &&
    loadingCreateBattle === false
  ) {
    return (
      <div>
        <React.Fragment>
          <div className="room-detail-list">
            {meetingLogsDetailSelector.userList ? (
              <React.Fragment>
                {userListId.value.map((p, key) => (
                  <div key={key} className="room-detail-person">
                    <img
                      className="room-detail-avatar"
                      src={
                        meetingLogsDetailSelector.userList.find(i => i.id === p)
                          ? meetingLogsDetailSelector.userList.find(
                            i => i.id === p,
                          ).avatar
                          : ''
                      }
                      alt=""
                    />
                    <p
                      style={{
                        marginTop: 25,
                        padding: '3px 10px',
                        borderRadius: '25px',
                        boxShadow: '0px 0px 36px 12px #e7c526',
                      }}
                    >
                      {meetingLogsDetailSelector.userList.find(i => i.id === p)
                        ? meetingLogsDetailSelector.userList.find(
                          i => i.id === p,
                        ).name
                        : ''}
                    </p>
                    {meetingLogsDetailSelector.userList.find(
                      i => i.id === p,
                    ) ? (
                        meetingLogsDetailSelector.userList.find(i => i.id === p)
                          .isDeposit ? (
                            <Button
                              variant="contained"
                              // disabled={currentPeople.value === totalPeople.value ? false : true}
                              color="white"
                              style={{
                                background: 'yellowgreen',
                                color: 'white',
                                fontWeight: 'bold',
                              }}
                            >
                              <FormattedMessage {...messages.deposited} />
                              <Icon
                                icon="ic:baseline-done-all"
                                fontSize="20px"
                                style={{ marginLeft: 10 }}
                              />
                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              onClick={() =>
                                joinGame(
                                  meetingLogsDetailSelector.userList.find(
                                    i => i.id === p,
                                  ),
                                )
                              }
                              disabled={
                                !!(Number(p) !== userIdLocal || loadingDeposit)
                              }
                              color="white"
                              style={{
                                background: '#00B5AD',
                                color: 'white',
                                fontWeight: 'bold',
                                display: 'flex',
                                gap: 10,
                              }}
                            >
                              <FormattedMessage {...messages.deposit} />
                              {loadingDeposit && Number(p) === userIdLocal ? (
                                <Icon
                                  icon="eos-icons:bubble-loading"
                                  fontSize="20px"
                                  style={{ marginLeft: 10 }}
                                />
                              ) : (
                                <Icon
                                  icon="mdi:instant-deposit"
                                  fontSize="20px"
                                  style={{ marginLeft: 10 }}
                                />
                              )}
                            </Button>
                          )
                      ) : (
                        ''
                      )}
                  </div>
                ))}
              </React.Fragment>
            ) : (
              <React.Fragment>
                {userListId.value.map((p, key) => (
                  <div key={key} className="room-detail-person">
                    <img
                      className="room-detail-avatar"
                      src={
                        userList.find(i => i.id === p)
                          ? userList.find(i => i.id === p).avatar
                          : ''
                      }
                      alt=""
                    />
                    <p
                      style={{
                        marginTop: 25,
                        padding: '3px 10px',
                        borderRadius: '25px',
                        boxShadow: '0px 0px 36px 12px #e7c526',
                      }}
                    >
                      {userList.find(i => i.id === p)
                        ? userList.find(i => i.id === p).name
                        : ''}
                    </p>
                    {userList.find(i => i.id === p) ? (
                      userList.find(i => i.id === p).isDeposit ? (
                        <Button
                          variant="contained"
                          // disabled={currentPeople.value === totalPeople.value ? false : true}
                          color="white"
                          style={{
                            background: 'yellowgreen',
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        >
                          <FormattedMessage {...messages.deposited} />
                          <Icon
                            icon="ic:baseline-done-all"
                            fontSize="20px"
                            style={{ marginLeft: 10 }}
                          />
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          onClick={() =>
                            joinGame(userList.find(i => i.id === p))
                          }
                          disabled={
                            !!(Number(p) !== userIdLocal || loadingDeposit)
                          }
                          color="white"
                          style={{
                            background: '#00B5AD',
                            color: 'white',
                            fontWeight: 'bold',
                            display: 'flex',
                            gap: 10,
                          }}
                        >
                          <FormattedMessage {...messages.deposit} />
                          {loadingDeposit && Number(p) === userIdLocal ? (
                            <Icon
                              icon="eos-icons:bubble-loading"
                              fontSize="20px"
                              style={{ marginLeft: 10 }}
                            />
                          ) : (
                            <Icon
                              icon="mdi:instant-deposit"
                              fontSize="20px"
                              style={{ marginLeft: 10 }}
                            />
                          )}
                        </Button>
                      )
                    ) : (
                      ''
                    )}
                  </div>
                ))}
              </React.Fragment>
            )}
          </div>
        </React.Fragment>
      </div>
    );
  }
  return (
    <div>
      <React.Fragment>
        <div className="room-detail-list">
          {userListId.value.map((p, key) => (
            <div key={key} className="room-detail-person">
              {checkOwnerRoom &&
              userList.find(
                i => i.ownerRoom === roomDetailDataModified.id.value,
              ).id !== p &&
              !roomDetailDataModified.isRunning.value ? (
                <Icon
                  icon="mdi:remove-outline"
                  fontSize="30px"
                  style={{ marginLeft: 10, cursor: 'pointer' }}
                  onClick={() => handleKick(p)}
                />
              ) : (
                  <div style={{ height: 30 }} />
              )}
              <img
                className="room-detail-avatar"
                src={
                  userList.find(i => i.id === p)
                    ? userList.find(i => i.id === p).avatar
                    : ''
                }
                alt=""
              />
              {friendListDataSelector.find(
                m => !(m.userId1 === p) || !(m.userId2 === p),
              ) || userIdLocal === Number(p) ? null : (
                <Icon
                  icon={
                    sendAddFriendState
                      ? 'eos-icons:bubble-loading'
                      : 'fluent-mdl2:add-friend'
                  }
                  style={{ marginLeft: 10, color: 'white' }}
                  className="add-friend"
                  onClick={() => sendAddFriend(userList.find(i => i.id === p))}
                />
              )}
              <p
                style={{
                  marginTop: 25,
                  padding: '3px 10px',
                  borderRadius: '25px',
                  boxShadow: '0px 0px 36px 12px #e7c526',
                }}
              >
                {userList.find(i => i.id === p)
                  ? userList.find(i => i.id === p).name
                  : ''}
              </p>
            </div>
          ))}
        </div>
        {!roomDetailDataModified.isRunning.value &&
        roomDetailDataModified.userListId.value.length > 1 ? (
          <div className="room-detail-start">
            {checkOwnerRoom && inReceiveReward === false ? (
              <Button
                variant="contained"
                onClick={() => handleCreateBattle()}
                disabled={loadingCreateBattle}
                color="white"
                style={{
                  background: '#00B5AD',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              >
                <FormattedMessage {...messages.createBattle} />
                {loadingCreateBattle ? (
                  <Icon
                    icon="eos-icons:bubble-loading"
                    fontSize="20px"
                    style={{ marginLeft: 10 }}
                  />
                ) : (
                  <Icon
                    icon="codicon:game"
                    fontSize="20px"
                    style={{ marginLeft: 10 }}
                  />
                )}
              </Button>
            ) : null}
          </div>
        ) : null}
      </React.Fragment>
    </div>
  );
};

export default Arena;
