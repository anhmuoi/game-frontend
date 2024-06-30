import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Flex, Text } from 'crox-new-uikit';
import { Icon } from '@iconify/react';
import useMediaQuery from 'use-mediaquery';
import ReactModal from 'react-modal';
import { injected } from './connector.js';
import ReactiveButton from 'reactive-button';
import '../css/style-common.css';
import '../css/style-basic.css';
import './header.css';
import { ethers } from 'ethers';
import { FormattedMessage } from 'react-intl';
import messages from './messages.js';
import SelectUI from 'components/SelectUI';
import { localstoreUtilites } from '../../utils/persistenceData.js';
import Api from './api';

let isConfirm = false;
const LANGUAGE = [
  {
    id: 'en-US',
    name: (
      <Icon
        icon="twemoji:flag-england"
        color="#00B5AD"
        width="30"
        height="30"
      />
    ),
  },
  {
    id: 'ko-KR',
    name: (
      <Icon icon="fxemoji:koreaflag" color="#00B5AD" width="30" height="30" />
    ),
  },
  {
    id: 'vi-VN',
    name: (
      <Icon
        icon="twemoji:flag-vietnam"
        color="#00B5AD"
        width="30"
        height="30"
      />
    ),
  },
];
const lang = localstoreUtilites.getLanguageFromLocalStorage();

function Header(props) {
  const { setToggle, loginByAddress, history } = props;
  const {
    account,
    activate,
    deactivate,
    error,
    active,
    chainId,
  } = useWeb3React();

  const [isNetworkSelectModalOpen, setIsNetworkSelectModalOpen] = useState(
    false,
  );

  const handleLogin = () => {
    isConfirm = true;
    localStorage.setItem('accountStatus', '1');
    return activate(injected);
  };

  const handleLogout = () => {
    isConfirm = false;
    localStorage.removeItem('accountStatus');
    deactivate();
    window.location.href = `${window.location.origin}/login`;
  };

  function copyToClipBoard() {
    var x = document.getElementById('snackbar');
    x.className = 'show';
    setTimeout(function () {
      x.className = x.className.replace('show', '');
    }, 3000);
  }

  function closeModal() {
    setIsNetworkSelectModalOpen(false);
  }

  const [balance, setBalance] = useState(null);
  const [accountProfile, setAccountProfile] = useState({});
  const [language, setLanguage] = useState(lang || 'en-US');

  useEffect(() => {
    const getAccount = (id) => {
      try {
        const res = Api.getAccount(id);
        setAccountProfile(res);
        return res;
      } catch (error) {
        console.log(error);
        throw error;
      }
    };
    const id = localstoreUtilites.getUserIdFromLocalStorage();

    // if (localStorage.getItem('accountStatus')) {
    //   getAccount(id);
    // }
  }, []);

  useEffect(() => {
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
                    rpcUrls: ['https://data-seed-prebsc-2-s2.binance.org:8545'], // Binance Smart Chain Testnet RPC URL
                    blockExplorerUrls: ['https://testnet.bscscan.com'], // Binance Smart Chain Testnet Block Explorer URL
                  },
                ],
              });
            } catch (addError) {
              console.error(addError);
            }
          }
        }
        activate(injected);
      })();
      isConfirm = false;
    }
  }, [chainId, activate]);

  useEffect(() => {
    async function fetchData() {
      if (active && account) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(account);
        setBalance(ethers.utils.formatEther(balance));
        loginByAddress(account, ethers.utils.formatEther(balance));
      } else if (!active && localStorage.getItem('accountStatus')) {
        activate(injected);
      }
    }
    fetchData();
  }, [active, account, activate]);

  const customStyles = {
    content: {
      top: '65px',
      left: 'auto',
      right: '10px',
      bottom: 'auto',
      backgroundColor: 'transparent',
      border: 'none',
      overflow: 'hidden',
    },
  };

  ReactModal.defaultStyles.overlay.backgroundColor = 'rgba(0,0,0,0)';

  const isMobile = useMediaQuery('(max-width: 600px)');

  const handleChangeLanguage = async (e) => {
    setLanguage(e.target.value);
    localstoreUtilites.saveLanguageToLocalStorage(e.target.value);
    const res = await Api.updatePreference({
      language: e.target.value,
    });

    window.location.reload();
    return res;
  };

  return (
    <div
      justifyContent={isMobile ? 'space-between' : 'flex-end'}
      className="header"
    >
      {isMobile && (
        <Flex m="20px 10px">
          <ReactiveButton
            idleText={
              <Icon icon="line-md:menu-unfold-left" width="24" height="24" />
            }
            color="teal"
            onClick={() => setToggle(true)}
            rounded
            shadow
          />
        </Flex>
      )}
      {!account ? (
        <Flex
          m={isMobile ? '20px 10px' : '20px'}
          style={{ justifyContent: 'flex-end' }}
        >
          <ReactiveButton
            style={{ height: 42 }}
            idleText={
              <Flex alignItems="center">
                <Icon
                  icon="logos:metamask-icon"
                  color="white"
                  width="25"
                  height="25"
                />
                <Text ml="5px" bold>
                  Connect Wallet
                </Text>
              </Flex>
            }
            size="large"
            color="teal"
            onClick={handleLogin}
            rounded
            shadow
          />
        </Flex>
      ) : (
        <Flex
          m={isMobile ? '20px 10px' : '20px'}
          style={{ justifyContent: 'flex-end' }}
        >
          <ReactiveButton
            style={{ background: '#00B5AD !important' }}
            idleText={
              <Flex alignItems="center" style={{ color: 'white' }}>
                <lottie-player
                  autoplay
                  loop
                  mode="normal"
                  src="https://assets7.lottiefiles.com/packages/lf20_yZpLO2.json"
                  style={{ width: '60px', margin: '-20px -10px -10px' }}
                />
                <Text ml="5px" mr="10px" bold>
                  {account.slice(0, 4)}...{account.slice(-4)}
                </Text>
                <Icon
                  icon="ant-design:caret-down-filled"
                  color="white"
                  width="15"
                  height="15"
                />
              </Flex>
            }
            size="large"
            color="teal"
            onClick={() => setIsNetworkSelectModalOpen(true)}
            rounded
            shadow
          />
          <ReactModal
            isOpen={isNetworkSelectModalOpen}
            onRequestClose={() => closeModal()}
            style={customStyles}
          >
            <Flex flexDirection="column" className="accountModal">
              <Flex
                alignItems="center"
                justifyContent="space-between"
                style={{ color: 'rgb(0, 181, 173)' }}
              >
                <Text bold>Account</Text>
                <ReactiveButton
                  idleText={
                    <Flex alignItems="center">
                      <Icon
                        icon="clarity:logout-line"
                        color="#f4516c"
                        width="15"
                        height="15"
                      />
                      <Text fontSize="12px" ml="3px">
                        Logout
                      </Text>
                    </Flex>
                  }
                  size="small"
                  onClick={handleLogout}
                  color="red"
                  outline
                  rounded
                />
              </Flex>
              <Flex
                alignItems="center"
                mt="20px"
                style={{ color: 'rgb(0, 181, 173)' }}
              >
                <Icon icon="et:wallet" color="#00B5AD" width="30" height="30" />
                <Text m="0 10px" bold>
                  {account.slice(0, 7)}...{account.slice(-7)}
                </Text>
                <div
                  onClick={() => {
                    navigator.clipboard.writeText(account);
                    copyToClipBoard();
                  }}
                  className="cursor-pointer"
                >
                  <Icon
                    icon="fluent:copy-24-filled"
                    color="#00B5AD"
                    width="30"
                    height="30"
                  />
                </div>
              </Flex>
              <Flex
                alignItems="center"
                mt="20px"
                style={{ color: 'rgb(0, 181, 173)' }}
              >
                <Icon
                  icon="material-symbols:language"
                  color="#00B5AD"
                  width="30"
                  height="30"
                />
                <Text m="0 10px" bold>
                  <FormattedMessage {...messages.changeLanguage} />
                </Text>
                <div
                  onClick={() => {}}
                  style={{ height: 75 }}
                  className="cursor-pointer"
                >
                  <SelectUI
                    value={language}
                    onChange={(e) => handleChangeLanguage(e)}
                    options={LANGUAGE}
                    name="language"
                    id="language"
                  />
                </div>
              </Flex>
              <Flex
                alignItems="center"
                mt="20px"
                style={{ color: 'rgb(0, 181, 173)', cursor: 'pointer' }}
                onClick={() => history.push('/change-password')}
              >
                <Icon
                  icon="solar:password-outline"
                  color="#00B5AD"
                  width="30"
                  height="30"
                />
                <Text m="0 10px" bold>
                  <FormattedMessage {...messages.changePassword} />
                </Text>
                <div className="cursor-pointer">
                  <Icon
                    icon="bxs:right-arrow"
                    color="#00B5AD"
                    width="30"
                    height="30"
                  />
                </div>
              </Flex>
            </Flex>
          </ReactModal>
          <div id="snackbar">Copied</div>
        </Flex>
      )}
    </div>
  );
}

export default Header;
