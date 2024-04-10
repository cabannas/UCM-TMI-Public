import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';


import { FeelsicPage } from './feelsic.page';

describe('FeelsicPage', () => {
  let component: FeelsicPage;
  let fixture: ComponentFixture<FeelsicPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeelsicPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FeelsicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
