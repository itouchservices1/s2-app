import { Component, AfterViewInit,OnInit, OnDestroy, ElementRef, ViewChild, Renderer2, HostListener } from '@angular/core';
import { CommonFunctionsService, NgxToasterService, SeoService, UserService } from '../../_services';
import { environment } from '../../../environments/environment';
import { Subject, takeUntil } from 'rxjs';
import { TextSetting } from '../../textsetting';
import { ActivatedRoute, Router } from '@angular/router';
import { embedDashboard } from '@superset-ui/embedded-sdk';


@Component({
    selector     : 'app-survey-dashboard',
    standalone   : false,
    providers    :  [SeoService],
    templateUrl  : './survey-dashboard.component.html',
    styleUrl     : './survey-dashboard.component.css'
})
export class SurveyDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('dashboardContainer', { static: false }) dashboardContainer!: ElementRef;

    // Fullscreen & Timer Start
    public isFullscreen: boolean = false;
    private readonly refreshIntervalSeconds: number = 3600; // 1 hour
    public remainingTimeSeconds: number = this.refreshIntervalSeconds;
    public timerDisplay: string = '01:00:00';
    private timerInterval: any;
    // Fullscreen & Timer End

    private ngUnsubscribe: Subject<void> = new Subject<void>();
    env = environment
    dataloading: boolean = true;
    metaData: any | undefined;
    metaDashboardId: any = '';
    TextSetting: any = TextSetting;
    dashboardType: any = '';


    // Properties to hold user input
    supersetUrl: string = ''; // 'http://10.0.0.234:8088'; // Default or example Superset URL
    // dashboardId: string = '567859f1-12fe-443c-ada1-7a5b0fb14b48'; // e.g., 'your-dashboard-uuid' or numerical ID as string
    dashboardId: string = ''; // e.g., 'your-dashboard-uuid' or numerical ID as string
    guestToken: string = '';  // This token MUST be pre-fetched securely.

    isLoading: boolean = false;
    errorMessage: string | null = null;

    constructor(public router: Router, public route: ActivatedRoute, private renderer : Renderer2, private commonFunctionService: CommonFunctionsService, public seoService: SeoService, public toastrNotification: NgxToasterService) { }
    ngOnInit(): void {
        // this.route.params.subscribe((params: any) => {
        //     if (params['dashboard_type'] !== '' && params['dashboard_type'] != undefined) {
        //         this.dashboardType = params['dashboard_type'];
        //         this.metaData = undefined;
        //     }
        //     if (params['meta_dashboard_id'] != '' && params['meta_dashboard_id'] != undefined) {
        //         this.metaDashboardId = params['meta_dashboard_id'];
        //         /**Calling function to get department files details */
        //         // this.getMetaDashboardDetails();
        //     }
        // });
        // this.seoService.generateTags({
        //     title: this.TextSetting.GENERAL_META_DASHBOARD_TITLE,
        // });
        this.supersetUrl = this.env.SUPERSET_BASE_URL;
        this.formatTime(); // Initialize display time
    }

    ngAfterViewInit() {


        setTimeout(() => {
            this.route.params.subscribe((params: any) => {
                if (params['dashboard_type'] !== '' && params['dashboard_type'] != undefined) {
                    this.dashboardType = params['dashboard_type'];
                    this.metaData = undefined;
                }
                if (params['dashboard_id'] != '' && params['dashboard_id'] != undefined) {
                    this.metaDashboardId = params['dashboard_id'];
                    /**Calling function to get department files details */
                    this.getMetaDashboardDetails();
                }
            });
            // this.getMetaDashboardDetails();    
            //this.dashboardContainer.nativeElement.style.height = '100vh';
            //this.dashboardContainer.nativeElement.style.width = '100%';

            this.commonFunctionService.isBrowser.subscribe((isBrowser: any) => {
                if (isBrowser) {
                    
                    this.seoService.generateTags({
                        title: this.TextSetting.SURVEY_DASHBOARD_TITLE,
                    });
                }
            })


        }, 1000);

        // Add the full-screen listener for when user presses ESC
        document.addEventListener('fullscreenchange', this.onFullscreenChange);
        document.addEventListener('webkitfullscreenchange', this.onFullscreenChange);
        document.addEventListener('mozfullscreenchange', this.onFullscreenChange);
        document.addEventListener('msfullscreenchange', this.onFullscreenChange);
    }

    /** 
     * @desc Function used to get dashboard details
     * @method getDashboardDetails
     * @param none
     * @return {none}
     */
    public getMetaDashboardDetails(): void {

        let methodName = ''
        if (this.dashboardType == this.env.METABASE_ROUTE) {
            methodName = 'metabase_dashbord_details'
        } else {
            methodName = 'get_superset_dashbord_details'
        }
        this.dataloading = true
        let input: any = {};
        input['dashboard_id'] = this.metaDashboardId;
        
        this.commonFunctionService.getMetaDashboardDetails(input, methodName).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
            
            if (response.status === this.env.SUCCESS_STATUS) {
                this.metaData = response

                if (this.dashboardType == this.env.SUPERSET_ROUTE) {
                    this.dashboardId = (response.embed_uuid) ? response.embed_uuid : "";
                    this.guestToken = (response.guest_token) ? response.guest_token : "";
                    this.embedSupersetDashboard();
                } else {
                    this.dataloading = false;
                }
            } else {
                this.dataloading = false;
                this.router.navigate(['/home']);
                this.toastrNotification.showError('Embedding is currently not activated for this dashboard.');
            }
        });
    }


    /**
   * Embeds the Superset dashboard using the provided details.
   */
    async embedSupersetDashboard(): Promise<void> {

        this.errorMessage = null;
        this.isLoading = true;


        // Validate inputs
        if (!this.supersetUrl || !this.dashboardId || !this.guestToken) {
            this.errorMessage = 'Superset URL, Dashboard ID, and Guest Token are required.';
            this.isLoading = false;
            console.error(this.errorMessage);
            return;
        }

        if (!this.dashboardContainer || !this.dashboardContainer.nativeElement) {
            this.errorMessage = 'Dashboard container element not found in the DOM.';
            this.isLoading = false;
            console.error(this.errorMessage);
            return;
        }

        // Clear any previous dashboard from the container
        // this.dashboardContainer.nativeElement.innerHTML = '';

        try {
            // Call the Superset Embedded SDK to embed the dashboard
            await embedDashboard({
                id: this.dashboardId, // The ID or UUID of the dashboard
                supersetDomain: this.supersetUrl.replace(/\/$/, ''), // Superset instance URL (remove trailing slash if any)
                mountPoint: this.dashboardContainer.nativeElement, // The HTML element to embed into
                fetchGuestToken: async () => this.guestToken, // Function that returns the guest token
                dashboardUiConfig: { // Optional: Customize the dashboard's appearance
                    hideTitle: false,
                    hideChartControls: false,
                    hideTab: false,
                },
                debug: true // Optional: for more logs in console
            });
            this.dataloading = false;
        } catch (error: any) {
            this.errorMessage = `Error embedding dashboard: ${error.message || error}`;
            console.error('Error embedding dashboard:', error);
        } finally {
            this.isLoading = false;
        }
    }

    public toggleFullscreen(): void {
        const docEl = document.documentElement;
        const body = document.body;

        if (!this.isFullscreen) {
            const requestFullScreen = docEl.requestFullscreen || (docEl as any).mozRequestFullScreen || (docEl as any).webkitRequestFullScreen || (docEl as any).msRequestFullscreen;

            if (requestFullScreen) {
                requestFullScreen.call(docEl);
                this.isFullscreen = true;
                this.renderer.addClass(body, 'fullscreen-active');

                // START TIMER
                this.resetTimer();
                this.startTimer();
            }
            else {
                console.warn('Fullscreen mode is not fully supported by this browser.');
                // Fallback to local state toggle and class application
                this.isFullscreen = true;
                this.renderer.addClass(body, 'fullscreen-active');

                // START TIMER (even if native fails, for visual elements)
                this.resetTimer();
                this.startTimer();
            }
        }
        else {
            // Exit Fullscreen
            const exitFullScreen = document.exitFullscreen || (document as any).mozCancelFullScreen || (document as any).webkitExitFullscreen || (document as any).msExitFullscreen;

            if (exitFullScreen) {
                exitFullScreen.call(document);
            }
            // The class removal and state update is handled by onFullscreenChange
        }

        this.adjustDashboardHeight();
    }

    /**
     * @desc Event handler for native fullscreen state changes (e.g., ESC key press).
     */
    private onFullscreenChange = (): void => {
        const isCurrentlyFullscreen = !!( document.fullscreenElement || (document as any).mozFullScreenElement || (document as any).webkitFullscreenElement || (document as any).msFullscreenElement );

        if (this.isFullscreen !== isCurrentlyFullscreen) {
            this.isFullscreen = isCurrentlyFullscreen;
            if (isCurrentlyFullscreen) {
                this.renderer.addClass(document.body, 'fullscreen-active');
                this.resetTimer(); 
                this.startTimer();
            } else {
                this.renderer.removeClass(document.body, 'fullscreen-active');
                this.stopTimer();
                this.resetTimer();
            }
            
            this.adjustDashboardHeight();
        }
    }

    /**
     * @desc Sets the height of the dashboard container dynamically based on fullscreen status.
     */
    private adjustDashboardHeight(): void {
        // Only run this if the container is available and we are dealing with Superset (since Metabase uses an iframe with fixed height)
        if (!this.dashboardContainer || !this.dashboardContainer.nativeElement || this.dashboardType !== this.env.SUPERSET_ROUTE) {
            return;
        }
        
        if (this.isFullscreen) {
            // In fullscreen mode, calculate the required height to fill the viewport (100vh)
            this.renderer.setStyle(this.dashboardContainer.nativeElement, 'height', '100vh');
            this.renderer.setStyle(this.dashboardContainer.nativeElement, 'width', '100%');
        } else {
            // Revert to default height settings when exiting fullscreen
            this.renderer.removeStyle(this.dashboardContainer.nativeElement, 'height');
            this.renderer.removeStyle(this.dashboardContainer.nativeElement, 'width');
        }
    }

    // Show Timer

    private formatTime(): void {
        const hours = Math.floor(this.remainingTimeSeconds / 3600);
        const minutes = Math.floor((this.remainingTimeSeconds % 3600) / 60);
        const seconds = this.remainingTimeSeconds % 60;

        this.timerDisplay = [hours, minutes, seconds]
            .map(v => v < 10 ? '0' + v : v)
            .join(':');
    }

    private startTimer(): void {
        this.stopTimer(); // Clear any existing interval
        
        this.timerInterval = setInterval(() => {
            if (this.remainingTimeSeconds > 0) {
                this.remainingTimeSeconds--;
                this.formatTime();
            } else {
                this.handleTimerFinish();
            }
        }, 1000);
    }

    private stopTimer(): void {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    public resetTimer(): void {
        this.stopTimer();
        this.remainingTimeSeconds = this.refreshIntervalSeconds;
        this.formatTime();
    }

    private handleTimerFinish(): void {
        
        
        // Reload dashboard data
        if (this.metaDashboardId) {
            // This reloads the data and either embeds Superset or updates Metabase iframe source
            this.getMetaDashboardDetails(); 
        } else if (this.dashboardType == this.env.SUPERSET_ROUTE) {
            // Direct call for Superset if metaDashboardId wasn't set, ensuring fresh data fetch
            this.embedSupersetDashboard();
        }

        // Reset and restart the timer for the next cycle
        this.resetTimer();
        this.startTimer();
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();

        this.stopTimer(); // Clear interval on destroy

        // Remove the listeners on destroy ---
        document.removeEventListener('fullscreenchange', this.onFullscreenChange);
        document.removeEventListener('webkitfullscreenchange', this.onFullscreenChange);
        document.removeEventListener('mozfullscreenchange', this.onFullscreenChange);
        document.removeEventListener('msfullscreenchange', this.onFullscreenChange);

        // Ensure the class is removed if the component is destroyed while in fullscreen state
        this.renderer.removeClass(document.body, 'fullscreen-active');
    }
}