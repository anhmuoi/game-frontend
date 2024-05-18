import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { RESTART_ON_REMOUNT } from 'utils/constants';
import { withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import InputUI from 'components/InputUI';
import reducer from './reducer';
import saga from './saga';
import { changeInput, game, changePassword, resetDataModels } from './actions';
import { makeSelectorPassword, getRedirect } from './selectors';
import messages from './messages';
import { battlegrounds, card52, power } from '../../images/people/index.js';
import './styles.css';
import { Tooltip } from '@material-ui/core';

const styles = (theme) => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 10,
    marginLeft: '25%',
    width: '50%',
  },
  marginTopElement: {
    marginTop: theme.spacing.unit,
  },
  btnChangePass: {
    marginTop: theme.spacing.unit * 3,
  },
});
const player1 = {
  id: 1,
  avatar: '',
  name: 'player 1',
  hp: 100,
  mana: 100,
};
const player2 = {
  id: 2,
  avatar: '',
  name: 'player 2',
  hp: 100,
  mana: 100,
};

class Game extends React.Component {
  state = {
    cardGame: [...card52],
    turn: 1,
  };
  // Hàm xáo trộn mảng các card
  shuffleCards = () => {
    const { cardGame } = this.state;
    // Tạo một bản sao của mảng cardGame
    let shuffledCards = [...cardGame];
    // Sử dụng thuật toán Fisher-Yates để xáo trộn mảng
    for (let i = shuffledCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledCards[i], shuffledCards[j]] = [
        shuffledCards[j],
        shuffledCards[i],
      ];
    }
    // Cập nhật state với mảng cardGame đã được xáo trộn
    this.setState({ cardGame: shuffledCards });
  };

  componentDidMount = () => {
    this.shuffleCards();
  };

  changeInput = (evt) =>
    this.props.onChangeInput(evt.target.name, evt.target.value);

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { redirectInfo } = nextProps;
    const { value, route } = redirectInfo.toJS();
    if (value) {
      this.props.onResetDataModels();
      this.props.history.push(route);
    }
  }
  clickCard = (id) => {
    const { cardGame } = this.state;
    let newListCard = [];
    cardGame.map((item) => {
      if (item.id === id) {
        newListCard.push({
          ...item,
          choose: true,
        });
      } else {
        newListCard.push(item);
      }
    });

    this.setState({
      cardGame: newListCard,
    });
  };

  render() {
    const { cardGame } = this.state;
    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        <img
          style={{
            width: '100%',
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}
          src={battlegrounds[0].image}
          alt=""
        />

        <div
          style={{
            position: 'absolute',
            width: '70%',
            transform: 'translateX(-50%)',
            left: '50%',
            top: '30%',
            display: 'flex',
            gap: 5,
            flexWrap: 'wrap',
            paddingTop: 50,
          }}
        >
          <div className="player">
            <div className="info">
              <img className="avatar" src={player2.avatar} alt="" />
              <div className="name">{player2.name}</div>
              {power.map((item) => (
                <React.Fragment>
                  {item.name ? (
                    <Tooltip key={item.id} title={item.name}>
                      <img src={item.image} className="power" alt="" />
                    </Tooltip>
                  ) : null}
                </React.Fragment>
              ))}
            </div>
            <div className="hp">
              {new Array(player2.hp).fill(0).map((i, key) => (
                <div key={key} className="hp-item"></div>
              ))}
            </div>
            <div className="mana">
              {new Array(player2.hp).fill(0).map((i, key) => (
                <div key={key} className="mana-item"></div>
              ))}
            </div>
          </div>

          {cardGame.map((card) => (
            <img
              src={card.choose ? card.image : card.deck}
              alt=""
              key={card.id}
              style={{ width: 60, zIndex: 10, cursor: 'pointer' }}
              onClick={() => this.clickCard(card.id)}
              
            />
          ))}

          <div className="player">
            <div className="info">
              <img className="avatar" src={player1.avatar} alt="" />
              <div className="name">{player1.name}</div>
              {power.map((item) => (
                <React.Fragment>
                  {item.name ? (
                    <Tooltip key={item.id} title={item.name}>
                      <img src={item.image} className="power" alt="" />
                    </Tooltip>
                  ) : null}
                </React.Fragment>
              ))}
            </div>
            <div className="hp">
              {new Array(player1.hp).fill(0).map((i, key) => (
                <div key={key} className="hp-item"></div>
              ))}
            </div>
            <div className="mana">
              {new Array(player1.hp).fill(0).map((i, key) => (
                <div key={key} className="mana-item"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Game.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object,
  passwordModel: PropTypes.object,
  redirectInfo: PropTypes.object,
  onChangeInput: PropTypes.func,
  onGame: PropTypes.func,
  onChangePassword: PropTypes.func,
  history: PropTypes.object,
  onResetDataModels: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeInput: (name, value) => dispatch(changeInput(name, value)),
    onGame: (token, newPass, confirmPass) =>
      dispatch(game(token, newPass, confirmPass)),
    onChangePassword: (model) => dispatch(changePassword(model)),
    onResetDataModels: () => dispatch(resetDataModels()),
  };
}

const mapStateToProps = createStructuredSelector({
  passwordModel: makeSelectorPassword(),
  redirectInfo: getRedirect(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'game', reducer });
const withSaga = injectSaga({
  key: 'game',
  saga,
  mode: RESTART_ON_REMOUNT,
});

export const GameTest = withStyles(styles)(Game);

export default withRouter(
  compose(withReducer, withSaga, withConnect)(withStyles(styles)(Game)),
);
