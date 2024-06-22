// src/Winner.js
import { Icon } from '@iconify/react';
import { Button, IconButton, Tooltip } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { injected } from '../../components/Header/connector.js';
import MultiGameAbi from '../../utils/MultiGame.json';
import { localstoreUtilites } from '../../utils/persistenceData.js';
import './Winner.css'; // Ensure you create a corresponding CSS file for styling
import messages from './messages.js';
import './styles.css';
import { power } from '../../images/people/index.js';

const getRandomItems = (array, num) => {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};
const Winner = ({
  winner,
  closeShowWinner,
  gameId,
  doneReceiveReward,
  itemSystemSelector,
  postAssignItemNFT,
}) => {
  const [message, setMessage] = useState(''); // State lưu trữ thông báo
  const [loading, setLoading] = useState(false); // State lưu trữ thông báo

  const {
    account,
    activate,
    deactivate,
    error,
    active,
    chainId,
  } = useWeb3React(); // Lấy địa chỉ tài khoản và thư viện Web3

  // Hàm xác định người chiến thắng
  const declareWinner = async (randomItems) => {
    if (!account) {
      setMessage('Please connect your wallet (MetaMask)');
      return;
    }

    try {
      setLoading(true);
      let randomItemsId = [];
      randomItems.map((i) => {
        randomItemsId.push(i.id);
      });
      postAssignItemNFT(randomItemsId);
      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      // const signer = provider.getSigner();
      // const contract = new ethers.Contract(
      //   window.env.REACT_APP_CONTRACT_ADDRESS,
      //   MultiGameAbi,
      //   signer,
      // );
      // const tx = await contract.declareWinner(gameId, winner.walletAddress);
      // await tx.wait();
      doneReceiveReward(gameId, randomItems);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('Error declaring winner:', error);
    }
  };

  useEffect(() => {
    if (!active && localStorage.getItem('accountStatus')) {
      activate(injected);
      console.log('a');
    }
  }, []);
  console.log(
    Number(localstoreUtilites.getUserIdFromLocalStorage()) ===
      Number(winner.id),
  );
  const randomItems = getRandomItems(
    itemSystemSelector.filter((i) => i.name),
    3,
  );

  console.log(randomItems);
  return (
    <div className="winner-container">
      <div
        style={{
          padding: '10px',
          textAlign: 'right',
          position: 'absolute',
          right: 0,
          top: 0,
        }}
      >
        <IconButton
          onClick={() => closeShowWinner()}
          style={{ color: 'white' }}
        >
          <Close />
        </IconButton>
      </div>
      <h1>Congratulations!</h1>
      <div className="winner-card">
        <img
          src={winner.avatar}
          alt={`${winner.name} avatar`}
          className="winner-image"
        />
        <div className="winner-info">
          <h2>{winner.name}</h2>
          <p>{`HP: ${winner.hp}`}</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
        {randomItems.map((item, key) => (
          <div>
            {item.name ? (
              <Tooltip key={item.id} title={`${item.name}, mana: ${item.mana}`}>
                <img
                  src={item.image}
                  className={`power ${item.isUse ? 'power-use' : ''}`}
                  alt=""
                />
              </Tooltip>
            ) : null}
          </div>
        ))}
      </div>

      {Number(localstoreUtilites.getUserIdFromLocalStorage()) ===
      Number(winner.id) ? (
        <Button
          variant="contained"
          onClick={() => declareWinner(randomItems)}
          disabled={loading}
          color="white"
          style={{
            background: '#00B5AD',
            color: 'white',
            fontWeight: 'bold',
            marginTop: 30,
          }}
        >
          <FormattedMessage {...messages.receiveReward} />
          {loading ? (
            <Icon
              icon="eos-icons:bubble-loading"
              fontSize="20px"
              style={{ marginLeft: 10 }}
            />
          ) : (
            <Icon
              icon="material-symbols:rewarded-ads-sharp"
              fontSize="20px"
              style={{ marginLeft: 10 }}
            />
          )}
        </Button>
      ) : null}
    </div>
  );
};

export default Winner;
