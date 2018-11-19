import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";
import { LoadingController } from "@ionic/angular";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  form = {
    email: "",
    password: ""
  };

  error: any;

  constructor(public auth: AuthService, public loading: LoadingController) {}

  ngOnInit() {}

  async signUpWithEmail() {
    this.error = null;
    const load = await this.loading.create();
    await load.present();
    try {
      await this.auth.signUpWithEmail({ ...this.form });
    } catch (error) {
      this.error = error;
    }
    await load.dismiss();
  }

  async signInWith(provider) {
    this.error = null;
    const load = await this.loading.create();
    await load.present();
    try {
      switch (provider) {
        case "facebook":
          await this.auth.signInWithFacebook();
          break;
        case "google":
          await this.auth.signInWithGoogle();
          break;
        case "email":
          await this.auth.signInWithEmail({ ...this.form });
          break;
      }
    } catch (error) {
      this.error = error;
    }
    await load.dismiss();
  }

  signOut() {
    this.auth.signOut();
  }
}
