import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function visibilityValidator(visibilityControlName: string, bioControlName: string, projectGoalsControlName: string,
    linkedinUrlControlName: string, githubUrlControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        const visibilityControl = formGroup.get(visibilityControlName)!

        const bioControl = formGroup.get(bioControlName)!
        const projectGoalsControl = formGroup.get(projectGoalsControlName)!
        const linkedinUrlControl = formGroup.get(linkedinUrlControlName)!
        const githubUrlControl = formGroup.get(githubUrlControlName)!

        const bioMinLength = 10
        const projectGoalsLength = 10

        // check if bio field is too short, if too short set error
        if (bioControl.value.length > bioMinLength) {
            const errors = visibilityControl.errors! || {}
            delete errors.bioShort
            visibilityControl.setErrors({ ...errors })
            if (Object.keys({...visibilityControl.errors}).length === 0) {
                visibilityControl.setErrors(null)
            }
        } else {
            const errors = visibilityControl.errors || {}
            visibilityControl.setErrors({ ...errors, bioShort: true })
        }

        // check if project goals is long enough
        if (projectGoalsControl.value.length > 10) {
            const errors = visibilityControl.errors! || {}
            delete errors.projectGoalsShort
            visibilityControl.setErrors({ ...errors })
            if (Object.keys({...visibilityControl.errors}).length === 0) {
                visibilityControl.setErrors(null)
            }
        } else {
            const errors = visibilityControl.errors || {}
            visibilityControl.setErrors({ ...errors, projectGoalsShort: true })
        }

        // check if there is a github or linkedin url
        if ((linkedinUrlControl.value && linkedinUrlControl.value.length > 10) || (githubUrlControl.value && githubUrlControl.value.length > 10)) {
            const errors = visibilityControl.errors! || {}
            delete errors.linkedinOrGithubNotProvided
            visibilityControl.setErrors({ ...errors })
            // set null if errors length is 0
            if (Object.keys({...visibilityControl.errors}).length === 0) {
                visibilityControl.setErrors(null)
            }
        } else {
            const errors = visibilityControl.errors! || {}
            visibilityControl.setErrors({ ...errors, linkedinOrGithubNotProvided: true })
        }
        // console.log(Object.keys({...visibilityControl.errors}).length)
        return null
    }
}

