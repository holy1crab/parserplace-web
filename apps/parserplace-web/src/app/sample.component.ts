import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-sample',
  templateUrl: `<h1>SAMPLE</h1>`,
})
export class SampleComponent implements OnInit {
  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {}
}
