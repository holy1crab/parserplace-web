import {TestBed} from '@angular/core/testing'
import {RouterModule} from '@angular/router'
import {NG_EVENT_PLUGINS} from '@taiga-ui/event-plugins'
import {AppComponent} from './app.component'

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterModule.forRoot([])],
      providers: [NG_EVENT_PLUGINS],
    }).compileComponents()
  })

  it(`should have as title 'parserplace-web'`, () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance
    expect(app.title).toEqual('parserplace-web')
  })
})
