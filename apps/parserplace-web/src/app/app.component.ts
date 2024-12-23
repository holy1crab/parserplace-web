import {Component} from '@angular/core'
import {RouterModule} from '@angular/router'
import {TuiRoot} from '@taiga-ui/core'

@Component({
  imports: [RouterModule, TuiRoot],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [],
})
export class AppComponent {
  title = 'parserplace-web'
}
