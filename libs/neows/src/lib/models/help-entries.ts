import { HelpEntry } from '@chrome-neo-plus/common';

/**
 * All NEOWS help entries reflect data returned from the NASA API directly.
 *
 */
export const NEOWS_HELP_ENTRIES: Array<HelpEntry> = [
  {
    key: 'sigma_tp',
    description: 'Time of perihelion passage sigma',
  },
  {
    key: 'diameter',
    description: 'Estimated object diameter',
    dataType: 'number',
  },
  {
    key: 'tp',
    description: 'time of perihelion passage',
  },
  {
    key: 'epoch_mjd',
    description: 'Epoch in Modified Julian Date',
    dataType: 'string',
  },
  {
    key: 'producer',
    description: 'Who computed the orbit',
    dataType: 'string',
  },
  {
    key: 'rms',
    description: 'Root Mean square',
    dataType: 'number',
  },
  {
    key: 'spec',
    description: 'SMASSII Spectral type value',
    // dataType: '',
  },
  {
    key: 'full_name',
    description: 'Name given by GPL',
    dataType: 'string',
  },
  {
    key: 'prov_des',
    description: '2001 AE2',
    // dataType: '',
  },
  {
    key: 'equinox',
    description: 'J2000',
    // dataType: '',
  },
  {
    key: 'diameter_sigma',
    description: 'Diameter sigma',
    dataType: 'number',
  },
  {
    key: 'neo',
    description: 'If the body is classified as an NEO',
    dataType: 'string',
  },
  {
    key: 'sigma_q',
    description: 'Sigma value of q perihelion distance',
    dataType: 'number',
  },
  {
    key: 'sigma_w',
    description: 'Sigma value of perihelion degree sigma',
    dataType: 'number',
  },
  {
    key: 'epoch',
    description: 'Orbital elements defined at this epoch',
    // dataType: '',
  },
  {
    key: 'per',
    description: 'Orbital Period',
    dataType: 'number',
  },
  {
    key: 'id',
    description: 'Id type',
    dataType: 'string',
  },
  {
    key: 'orbit_id',
    description: 'Orbit id',
    dataType: 'string',
  },
  {
    key: 'rot_per',
    description: 'Rotation period',
    dataType: 'number',
  },
  {
    key: 'last_obs',
    description: 'Last Observed date',
    dataType: 'string',
  },
  {
    key: 'class',
    description: 'AMO',
    dataType: 'string',
  },
  {
    key: 'a',
    description: 'Semi Major Access, in AU units',
    dataType: 'number',
  },
  {
    key: 't_jup',
    description: 'Jupiter tisserand invarient',
    // dataType: '',
  },
  {
    key: 'e',
    description: 'eccentricity',
    // dataType: '',
  },
  {
    key: 'name',
    description: 'official name given by NASA',
    dataType: 'string',
  },
  {
    key: 'i',
    description: 'inclination, in degrees',
    dataType: 'number',
  },
  {
    key: 'n',
    description: 'Mean Motion',
    // dataType: '',
  },
  {
    key: 'q',
    description: 'perihelion distance, in AU units',
    dataType: 'number',
  },
  {
    key: 'sigma_i',
    description: 'Inclination sigma',
    // dataType: '',
  },
  {
    key: 'w',
    description: 'Argument of perihelion in deg',
    dataType: 'number',
  },
  {
    key: 'first_obs',
    description: 'date of first observation used in the fit',
    // dataType: '',
  },
  {
    key: 'spkid',
    description: 'Small Body Database ID',
    dataType: 'string',
  },
];
