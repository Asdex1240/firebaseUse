import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { AvatarService } from '../services/avatar.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  profile = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private avatarService: AvatarService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { 

    this.avatarService.getUserProfile().subscribe(data => {
      this.profile = data;
      console.log(data);
    })
  }

  async logout() {
    this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
    console.log('Listo');
  }

  async changeImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
    });
    console.log(image);
    if(image){
      const loading = await this.loadingController.create();
      await loading.present();

      const result = await this.avatarService.uploadImage(image);
      loading.dismiss();

      if(!result){
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'No se pudo cambiar la imagen',
          buttons: ['OK']
        });
        await alert.present();
      }
    }
  }

}
