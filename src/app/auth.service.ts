import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { User, auth } from "firebase";
import { AuthProvider } from "firebase/auth";
import { Platform } from "@ionic/angular";
import { Observable } from "rxjs";
import { GooglePlus } from "@ionic-native/google-plus/ngx";
import { Facebook } from "@ionic-native/facebook/ngx";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  public user: Observable<User>;
  constructor(
    public fireAuth: AngularFireAuth,
    public platform: Platform,
    public googlePlus: GooglePlus,
    public facebook: Facebook
  ) {
    this.user = this.fireAuth.user;
  }

  async signInWithEmail({ email, password }) {
    return this.fireAuth.auth.signInWithEmailAndPassword(email, password);
  }

  async signUpWithEmail({ email, password }) {
    return this.fireAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  async signInWithGoogle() {
    return this.platform.is("cordova")
      ? this.oauthSignInCordova(
          auth.GoogleAuthProvider.credential(
            (await this.googlePlus.login({})).idToken
          )
        )
      : this.oauthSignInWeb(new auth.GoogleAuthProvider());
  }

  async signInWithFacebook() {
    return this.platform.is("cordova")
      ? this.oauthSignInCordova(
          auth.FacebookAuthProvider.credential(
            (await this.facebook.login(["email"])).authResponse.accessToken
          )
        )
      : this.oauthSignInWeb(new auth.FacebookAuthProvider());
  }

  async signOut() {
    return this.fireAuth.auth.signOut();
  }

  async oauthSignInCordova(
    authCredential: auth.AuthCredential
  ): Promise<auth.UserCredential> {
    return this.fireAuth.auth.signInAndRetrieveDataWithCredential(
      authCredential
    );
  }

  async oauthSignInWeb(provider: AuthProvider): Promise<auth.UserCredential> {
    return await this.fireAuth.auth.signInWithPopup(provider);
  }
}
