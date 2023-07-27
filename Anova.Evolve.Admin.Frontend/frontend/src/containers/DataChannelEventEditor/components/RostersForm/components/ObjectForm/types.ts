export interface RosterInForm {
  rosterId: number;
}

export interface Values {
  // Typed as undefined since Formik completely removes the property when
  // removing the last FieldArray item. Note that this may be fixed in future
  // Formik versions.
  rosters?: RosterInForm[];
}
