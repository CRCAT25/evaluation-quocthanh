import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DTOUserLogin } from '../../../pages/shared/dtos/DTOUserLogin.dto';
import { AuthorizationService } from '../../services/authorization.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {
  loginObj: DTOUserLogin = {
    username: '',
    password: '',
    grant_type: undefined,
    scope: undefined,
    client_id: undefined,
    client_secret: undefined
  };

  constructor(private router: Router, private authorizationService: AuthorizationService) {}

  ngOnInit(): void {
    this.loginObj.grant_type = 'password';
    this.loginObj.scope = 'adminapi offline_access';
    this.loginObj.client_id = 'admin';
    this.loginObj.client_secret = 'adminsecret';
  }

  onLogin(){
    this.authorizationService.onLogin(this.loginObj).subscribe(
      response => {
        // console.log('Token:', response.access_token);
        localStorage.setItem('tokenLogin', response.access_token)
        this.router.navigateByUrl('/hri/hri001-evaluation-list');
      },
      error => {
        console.error('Login failed', error);
      }
    );
  }
}
