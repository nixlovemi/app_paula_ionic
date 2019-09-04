import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-pg-perfil',
  templateUrl: './pg-perfil.page.html',
  styleUrls: ['./pg-perfil.page.scss'],
})
export class PgPerfilPage implements OnInit {
  @ViewChild("progressaoMedidas", {static: true}) progressaoMedidas: ElementRef;
  private lineChart: Chart;

  constructor() { }

  ngOnInit() {
    //this.iniciaGrafico();
    /*
    After:

    // query results available in ngOnInit
    @ViewChild('foo', {static: true}) foo: ElementRef;

    OR

    // query results available in ngAfterViewInit
    @ViewChild('foo', {static: false}) foo: ElementRef;
    */

    this.lineChart = new Chart(this.progressaoMedidas.nativeElement, {
      type: "line",
      data: {
        labels: ["1", "2", "3", "4", "5"],
        datasets: [
          {
            label: "Pesagens",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(6,176,197,0.4)",
            borderColor: "rgba(6,176,197,1)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(6,176,197,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(6,176,197,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [82, 81.5, 81.1, 79.1, 78.05],
            spanGaps: false
          }
        ],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            onClick: null
          }
        }
      }
    });
  }
}
