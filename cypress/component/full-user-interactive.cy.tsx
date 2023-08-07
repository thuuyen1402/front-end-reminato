import { routerConfig } from "@router/index";
import { Provider } from "@src/provider"
import { fakeVideoData, fakeVideoSharing } from "__mocks__/fake/video";
import { createMemoryRouter } from "react-router-dom";
import serviceVideo from '@services/video'
import serviceAuth from '@services/auth'
import { fakeLoginData, fakeUserData } from "__mocks__/fake/user";
import { AxiosError } from "axios";
import SocketMock from 'socket.io-mock';
import { faker } from "@faker-js/faker";



const router = createMemoryRouter(routerConfig, {
  initialEntries: ["/"]
});


describe("User navigated and interactive within pages", () => {

  beforeEach(() => {
    // Hide all XHR request
    cy.intercept('GET', '**/*', {
      log: false
    }).as('ignoreXHR');
    cy.intercept('POST', '**/*', {
      log: false
    }).as('ignoreXHR');



  })

  it('[Desktop] Full interactive', () => {
    cy.stub(serviceAuth, "authVerifyToken").rejects(new AxiosError("No auth"))

    const resolveData = {
      // XXXXX id for ignore many request from google
      data: fakeVideoData.slice(0, 4).map(f => { f.videoId = "xxxxxxx"; return f }),
      pagination: {
        cursor: fakeVideoData[4].id,
        isEnd: false
      }
    };

    const getVideosMock = cy.stub(serviceVideo, "videoGetVideos").resolves({
      data: resolveData
    })

    // Mock login
    cy.viewport("macbook-11");


    // Mock socket
    const socketServerMock = new SocketMock();
    const socketMockClient = socketServerMock.socketClient
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let originalOnFunction: (data: any) => void
    socketMockClient.on = cy.stub().callsFake((_eventName, callback) => {
      originalOnFunction = callback;
    }),
      socketMockClient.connected = true,
      socketMockClient.connect = cy.stub(),
      socketMockClient.disconnect = cy.stub(),
      socketMockClient.removeAllListeners = cy.stub()



    cy.mount(
      <Provider router={router} _mockSocket={socketMockClient} />
    )

    cy.get('input[placeholder="email"]').as('emailInput');
    cy.get('input[placeholder="password"]').as('passwordInput');

    cy.get('@emailInput')
      .should('exist')
      .should('be.visible');
    cy.get('@passwordInput')
      .should('exist')
      .should('be.visible');

    /* 1. Watch home page */

    cy.contains(fakeVideoData[0].title.slice(0, 10)).should("be.visible");
    cy.contains(fakeVideoData[1].title.slice(0, 10)).should("be.visible");

    /* 1.1 refresh video */

    cy.get('button[aria-label="refresh-button"]').should("be.visible").click().then(() => {
      cy.wrap(getVideosMock.callCount).should('be.gte', 2);
    });

    cy.wait(1000)
    /* 2. Login and register */
    /* 2.1 Failed validation email */


    cy.get('@emailInput')
      .type("abc")
      .should('have.value', "abc");

    //Submit
    cy.contains('Login / Register').click();
    // Wrong message
    cy.contains('Invalid email').should('be.visible');
    cy.wait(1000)
    /* 2.2 Failed validation password */

    cy.get('@emailInput')
      .clear()
      .type(fakeLoginData.email)
      .should('have.value', fakeLoginData.email);

    cy.get('@passwordInput')
      .type("12345")
      .should('have.value', "12345");


    cy.contains('Login / Register').click();
    cy.contains('password have at least 6 characters').should('be.visible');
    cy.wait(1000)
    /* 2.3. Failed login by server error */

    const authSignInStub = cy.stub(serviceAuth, "authSignIn")
      .rejects(new AxiosError("Incorrect username or password"));
    cy.get('@passwordInput')
      .clear()
      .type(fakeLoginData.password + "1")
      .should('have.value', fakeLoginData.password + "1");


    cy.contains('Login / Register').click();
    cy.contains("Incorrect username or password").should('be.visible').then(() => {
      authSignInStub.restore();
      cy.stub(serviceAuth, "authSignIn").resolves({
        data: {
          data: {
            user: fakeUserData
          }
        }
      });
    })
    cy.wait(2000)
    /* 2.4. Login success */

    cy.get('@passwordInput')
      .clear()
      .type(fakeLoginData.password)
      .should('have.value', fakeLoginData.password);

    cy.contains('Login / Register').click();
    cy.contains("Sign in success").should('be.visible');

    cy.wait(1000)

    /* 3. Like and unlike video */
    cy.wait(500).then(() => {
      cy.stub(serviceVideo, "videoVoteVideo").resolves({
        data: {
          data: true
        }
      });
    })

    cy.wait(1000)
    // Vote
    cy.get('i[aria-label="upvote"]').should("be.visible").click({
      multiple: true
    });

    cy.wait(1000)
    // Unvote
    cy.get('i[aria-label="upvote"]').should("be.visible").click({
      multiple: true
    });
    cy.wait(1000)
    //Disvote
    cy.get('i[aria-label="downvote"]').should("be.visible").click({
      multiple: true
    });


    /* 4. Watch a sharing video page */
    cy.wait(2000)
    cy.contains('Share a movie').click();

    cy.contains("Share a youtube movie").should('be.visible');

    cy.get('input[placeholder="url"]').as('urlInput');

    /* 4.1 Failed validation */

    cy.get("@urlInput").type("Not-is-the-url");
    cy.get('button').contains(/^Share$/).should('be.visible').click();
    cy.contains("Invalid url").should('be.visible')
    cy.wait(500)

    /* 4.2 Server error */
    const videoShareMock = cy.stub(serviceVideo, "videoSharing")
      .rejects(new AxiosError("Video is not exist!"));


    cy.get("@urlInput").clear().type(faker.internet.url());
    cy.wait(500)
    cy.get('button').contains(/^Share$/).should('be.visible').click();
    cy.wait(500)
    cy.contains("Video is not exist!").should("be.visible")


    /* 4.3 Share success */
    cy.wait(1000).then(() => {
      videoShareMock.restore();
      cy.stub(serviceVideo, "videoSharing")
        .resolves({
          data: true
        })
    })
    cy.get('button').contains(/^Share$/).should('be.visible').click();
    cy.wait(500)
    cy.contains("Sharing video success, your video will notify to the others").should('be.visible')

    /* 4.4 Other user get notify */
    cy.wait(2000)
    const fakeData = JSON.stringify({
      ...fakeVideoSharing,
      sharedBy: {
        id: "any-id",
        email: "any-email"
      }
    })

    socketServerMock.emit("new_video_sharing", fakeData);

    // Put to then cy wait 
    cy.wait(1000).then(() => {
      originalOnFunction(fakeData)
    })

    // Toast open
    cy.contains(fakeVideoSharing.title).should("be.visible");
    cy.wait(2000)
    cy.contains("Close").should("be.visible").click();
    cy.wait(1000)

    cy.stub(serviceAuth, "authLogout")
      .resolves({
        data: true
      })
    cy.contains("Funny Movies").click();
    cy.wait(3000);
    cy.contains("Logout").should("be.visible").click();
    cy.contains("Logout succeed").should("be.visible")
    cy.wait(5000);

  })

  it('[Mobile] Full interactive', () => {
    cy.stub(serviceAuth, "authVerifyToken").rejects(new AxiosError("No auth"))

    const resolveData = {
      // XXXXX id for ignore many request from google
      data: fakeVideoData.slice(0, 4).map(f => { f.videoId = "xxxxxxx"; return f }),
      pagination: {
        cursor: fakeVideoData[4].id,
        isEnd: false
      }
    };

    const getVideosMock = cy.stub(serviceVideo, "videoGetVideos").resolves({
      data: resolveData
    })

    // Mock login
    cy.viewport("iphone-x");


    // Mock socket
    const socketServerMock = new SocketMock();
    const socketMockClient = socketServerMock.socketClient
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let originalOnFunction: (data: any) => void
    socketMockClient.on = cy.stub().callsFake((_eventName, callback) => {
      originalOnFunction = callback;
    }),
      socketMockClient.connected = true,
      socketMockClient.connect = cy.stub(),
      socketMockClient.disconnect = cy.stub(),
      socketMockClient.removeAllListeners = cy.stub()



    cy.mount(
      <Provider router={router} _mockSocket={socketMockClient} />
    )


    /* 1. Watch home page */

    cy.contains(fakeVideoData[0].title.slice(0, 10)).should("be.visible");
    cy.contains(fakeVideoData[1].title.slice(0, 10)).should("be.visible");

    /* 1.1 refresh video */

    cy.get('button[aria-label="refresh-button"]').should("be.visible").click().then(() => {
      cy.wrap(getVideosMock.callCount).should('be.gte', 2);
    });

    cy.wait(1000)
    /* 2. Login and register */

    /* 2.0 Open/close modal login */

    // Open
    cy.get('[data-testid="modal-login"]').should("be.visible").click();
    cy.wait(1500);
    // Close
    cy.contains("Close").should("be.visible").click();
    cy.wait(1000);

    // Re-Open
    cy.get('[data-testid="modal-login"]').should("be.visible").click();
    cy.wait(1000);
    /* 2.1 Failed validation email */

    cy.get('input[aria-label="email-mobile"]').as('emailInput');
    cy.get('input[aria-label="password-mobile"]').as('passwordInput');



    cy.get('@emailInput')
      .should('exist')
      .should('be.visible');
    cy.get('@passwordInput')
      .should('exist')
      .should('be.visible');


    cy.get('@emailInput')
      .type("abc")
      .should('have.value', "abc");

    //Submit
    cy.get(`button[aria-label="login-button-mobile"]`).click();
    // Wrong message
    cy.contains('Invalid email').should('be.visible');
    cy.wait(1000)
    /* 2.2 Failed validation password */

    cy.get('@emailInput')
      .clear()
      .type(fakeLoginData.email)
      .should('have.value', fakeLoginData.email);

    cy.get('@passwordInput')
      .type("12345")
      .should('have.value', "12345");


    cy.get(`button[aria-label="login-button-mobile"]`).click();
    cy.contains('password have at least 6 characters').should('be.visible');
    cy.wait(1000)
    /* 2.3. Failed login by server error */

    const authSignInStub = cy.stub(serviceAuth, "authSignIn")
      .rejects(new AxiosError("Incorrect username or password"));
    cy.get('@passwordInput')
      .clear()
      .type(fakeLoginData.password + "1")
      .should('have.value', fakeLoginData.password + "1");


    cy.get(`button[aria-label="login-button-mobile"]`).click();
    cy.contains("Incorrect username or password").should('be.visible').then(() => {
      authSignInStub.restore();
      cy.stub(serviceAuth, "authSignIn").resolves({
        data: {
          data: {
            user: fakeUserData
          }
        }
      });
    })
    cy.wait(1000)
    /* 2.4. Login success */

    cy.get('@passwordInput')
      .clear()
      .type(fakeLoginData.password)
      .should('have.value', fakeLoginData.password);

    cy.get(`button[aria-label="login-button-mobile"]`).click();
    cy.contains("Sign in success").should('be.visible');

    cy.wait(1000)

    /* 3. Like and unlike video */
    cy.wait(500).then(() => {
      cy.stub(serviceVideo, "videoVoteVideo").resolves({
        data: {
          data: true
        }
      });
    })

    cy.wait(1000)
    // Vote
    cy.get('i[aria-label="upvote"]').should("be.visible").click({
      multiple: true
    });

    cy.wait(1000)
    // Unvote
    cy.get('i[aria-label="upvote"]').should("be.visible").click({
      multiple: true
    });
    cy.wait(1000)
    //Disvote
    cy.get('i[aria-label="downvote"]').should("be.visible").click({
      multiple: true
    });


    /* 4. Watch a sharing video page */
    cy.wait(2000)
    cy.get(`button[aria-label="sharing-button-mobile"]`).click();
    cy.wait(1000)

    cy.contains("Share a youtube movie").should('be.visible');

    cy.get('input[placeholder="url"]').as('urlInput');

    /* 4.1 Failed validation */

    cy.get("@urlInput").type("Not-is-the-url");
    cy.get('button').contains(/^Share$/).should('be.visible').click();
    cy.contains("Invalid url").should('be.visible')
    cy.wait(500)

    /* 4.2 Server error */
    const videoShareMock = cy.stub(serviceVideo, "videoSharing")
      .rejects(new AxiosError("Video is not exist!"));


    cy.get("@urlInput").clear().type(faker.internet.url());
    cy.wait(500)
    cy.get('button').contains(/^Share$/).should('be.visible').click();
    cy.wait(500)
    cy.contains("Video is not exist!").should("be.visible")


    /* 4.3 Share success */
    cy.wait(1000).then(() => {
      videoShareMock.restore();
      cy.stub(serviceVideo, "videoSharing")
        .resolves({
          data: true
        })
    })
    cy.get('button').contains(/^Share$/).should('be.visible').click();
    cy.wait(500)
    cy.contains("Sharing video success, your video will notify to the others").should('be.visible')

    /* 4.4 Other user get notify */
    cy.wait(2000)
    const fakeData = JSON.stringify({
      ...fakeVideoSharing,
      sharedBy: {
        id: "any-id",
        email: "any-email"
      }
    })

    socketServerMock.emit("new_video_sharing", fakeData);

    // Put to then cy wait 
    cy.wait(1000).then(() => {
      originalOnFunction(fakeData)
    })

    // Toast open
    cy.contains(fakeVideoSharing.title).should("be.visible");
    cy.wait(2000)
    cy.contains("Close").should("be.visible").click();
    cy.wait(1000)

    cy.stub(serviceAuth, "authLogout")
      .resolves({
        data: true
      })
    cy.get(`button[aria-label="logout-button-mobile"]`).should("be.visible").click();

  })
})