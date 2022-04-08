import React from 'react';
import { Controller } from "react-hook-form";
import Select from 'react-select';

function ControlledSelect({control, name, options, isMulti, isClearable, defaultValue}){
  const customStyles =  {
    dropdownIndicator: (base) => ({
      ...base,
      width: "50px"
    }),
    clearIndicator: (base) => ({
      ...base,
      width: "50px"
    }),
    indicatorsContainer: (base) => ({
      ...base,
      maxWidth: "100px"
    }),
    singleValue: (base) => ({
      ...base,
      paddingLeft: "5px"
    }),
    valueContainer: (base) => ({
      ...base,
      paddingLeft: "0px"
    }),
  }

  function getValueSelect(raw_data, isMulti){
      if (isMulti) {
          return raw_data.map((an_option) => (an_option.value));
      } else {
          return raw_data.value;
      }
  }

  return (
      <Controller
         control={control}
         name={name}
         render={({ field: { onChange, onBlur, value, ref} }) => (
           <div>
             <Select isMulti={isMulti} isClearable={isClearable} options={ options }
               isSearchable={true} inputRef={ref}
               onChange={(value) => {onChange(getValueSelect(value, isMulti))}}
               defaultValue={defaultValue}
               styles={customStyles}
             />
           </div>
         )}
      />
  )
}

export default ControlledSelect;
