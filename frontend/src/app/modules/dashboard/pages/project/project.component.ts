import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/shared/interfaces/Project';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  project!: Project;

  currentProjectId?: string;

  constructor(private projectService: ProjectService, private activatedRoute: ActivatedRoute) {

    this.currentProjectId = activatedRoute.snapshot.paramMap.get('id')!

    projectService.getProjectById(this.currentProjectId).subscribe((project: Project) => {
      this.project = project
    })

  }

  ngOnInit() {
  }

}
