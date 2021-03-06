import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { AuthComponent } from "./auth/auth.component";
import { AuthGuard } from "./auth/auth.guard";
import { HomeComponent } from "./home/home.component";


const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
     {path: 'auth', component: AuthComponent}
    
];

@NgModule({
    declarations: [
        
    ],
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule],
    bootstrap: [AppComponent]
})
export class AppRoutingModule{}