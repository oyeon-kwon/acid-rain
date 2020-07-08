import React, { Component } from 'react'
import { Nav, Login, PlayStage } from './pages'
import { Route, Redirect } from 'react-router-dom'
import { Play, Mypage } from './components'
import cookie from 'react-cookies'
const axios = require('axios');

class App extends Component {
  state = {
    userId: '',
    //db에 저장된 제일 첫번째 스테이지를 보여줘서 첫리스트가 선택된 상태로 보여지도록
    selectedStageName: 'test',
    stageContents: '',
    color: "#848484",
    // gameStart Flag
    gameStart: false,
    gameLevel: 0,
    //login상태가 되면 이 값이 true로 변하고 그 값을 이용해 로그인 여부 판단.
    isLogin: false,
    //게스트가 로그인 했을 때, 회원이 로그인 했을 때로 나눠서 Nav의 마이페이지버튼 생성, 비생성 조절
    isGuest: false,
    //makeStage컴포넌트의 노출 여부를 해당 state로 관리
    wantToMake: false,
    themaPageIsOpen: false,
    socialLogin: false,
    modalOpened: false
  }

  // gameStart Toggle
  gameStartToggle = () => {
    console.log('Game Start');
    this.setState(current => ({
      gameStart: !current.gameStart
    }));
  }

  // 로그인 유지
  async componentDidMount() {
    let result = await axios.post('http://localhost:5000/main/login', {
      'session': cookie.load('sessionKey')
    })
    this.setState({ isLogin: true, userId: result.data })
  }
  // 로그아웃
  logout = () => {
    this.setState({ isLogin: false, userId: '' })
    cookie.remove('sessionKey')
    console.log('this.state: ', this.state.userId);
  }


  handleColorChange = color => {
    this.setState({ color: color.hex });
  };


  clickStage = (name) => {
    if (name !== this.state.selectedStageName) {
      this.setState({ selectedStageName: name })
    }
  }
  // 유저의 로그인
  changeUserId = (user, social) => {
    if(social){
      this.setState({ userId: user, socialLogin: true, isLogin: true })
    } else {
      this.setState({ userId: user, isLogin: true })
    }

  }
  // 게스트의 로그인
  changeGuest = (guest) => {
    this.setState({ userId: guest, isGuest: true })
  }



  //스테이지 선택 버튼을 누르면 true로 값이 변하게
  handleStageButton = () => {
    this.setStage({ isSubmitedStage: true })
  }

  getContents = (clickedStage) => {
    this.setState({ stageContents: clickedStage })
  }

  handleMakingStage = () => {
    this.setState({ wantToMake: !this.state.wantToMake })
  }

  handleColorChange = color => {
    this.setState({ color: color.hex });
  };

  handleThemaPage = () => {
    this.setState({ themaPageIsOpen: !this.state.themaPageIsOpen })
  }

  opendMobal = () => {
    this.setState(current => ({
      modalOpened: !current.modalOpened
    }));
  } 



  gameStatusToFalse = () => {
    this.setState({ gameStart: false });
  }

  render() {
    const { userId, isGuest, selectedStageName, stageContents, gameStart,
      wantToMake, isLogin, themaPageIsOpen, color, gameLevel, socialLogin, modalOpened } = this.state


      let footerState =
      !isLogin ? "로그인을 진행해주세요."
      : (isLogin && !stageContents && !wantToMake) ? "스테이지를 고르고 엔터를 누르거나 M을 눌러 스테이지를 만들어보세요."
      : (stageContents && !gameStart) ? "게임을 시작하려면 엔터를 누르고 스테이지를 다시 선택하려면 ESC를 누르세요."
      : wantToMake ? "뒤로 돌아가려면 ESC를 누르세요."
      : !gameStart ? "엔터를 누르세요."
      : gameStart ? "뒤로 돌아가려면 ESC버튼을 누르고 게임을 중지하려면 엔터를 누르세요."

      : ''




    return (

      <div className='app' style={{ backgroundColor: this.state.color }}>
        
        {
          modalOpened
          ? <div className='modal'> 
              <div className="window Login-window">
                <div className="title-bar">
                  <div className="title-bar-controls">
                    <div className="title-bar-text">Logout-check</div>
                  </div>
                </div>
                <div className="window-body">
                  <fieldset id="login">
                    <p className="title" style={{ left:"34%", top: "25%", position: "absolute" }}>로그아웃 하시겠습니까?</p>
                    
                    {
                      <button id="checkBtn" 
                        // onClick={this.props.logout.bind(this)}
                      >확인</button>
                    }

                    <button id="selectBtn" 
                      onClick={this.opendMobal}
                    >취소</button>
                  </fieldset>
                </div>
              </div>
            </div>
          : null
        }

        <Nav
          userId={userId}
          isGuest={isGuest}
          isLogin={isLogin}
          changeUserId={this.changeUserId}
          themaPageIsOpen={themaPageIsOpen}
          handleThemaPage={this.handleThemaPage}
          color={color}
          handleColorChange={this.handleColorChange}
          logout={this.logout}
          socialLogin={socialLogin}
          gameStart={gameStart}
          wantToMake={wantToMake}
        />
        <Login
          userId={userId}
          isGuest={isGuest}
          isLogin={isLogin}
          logout={this.logout}
          changeUserId={this.changeUserId}
          changeGuest={this.changeGuest}
          stageContents={stageContents}
          clickStage={this.clickStage}
          getContents={this.getContents}
          selectedStageName={selectedStageName}
          wantToMake={wantToMake}
          handleMakingStage={this.handleMakingStage}
          socialLogin={socialLogin}
          gameStatusToFalse={this.gameStatusToFalse}
        />

        <Route
          path='/'
          render={() => {
            if (!isLogin) {
              return <Redirect to='/login' />
            }
            return <Redirect to='/selectstage' />
          }}
        />

        <Route
          path='/playstage'
          render={()=>
            <PlayStage userId={userId}
              selectedStageName={selectedStageName}
              stageContents={stageContents}
              color={color}
              gameLevel={gameLevel}
              gameStartToggle={this.gameStartToggle}
              gameStart={gameStart}
              opendMobal={this.opendMobal}
              modalOpened={modalOpened}
            />
          }></Route>
        <footer>

          <div className="footer">
            <p className="footer-text">{footerState}</p>
            <hr id="footer-bar"/>
            <p className="footer-title">산성비</p>
          </div>

        </footer>




      </div>
    )
  }
}



export default App;
