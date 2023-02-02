import { BasicModal } from "./BasicModals";
import s from "./Modals.module.css";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import * as React from "react";
import { useEffect, useState } from "react";
import { renameCardPackTC } from "bll/reducers/packs-reducer";
import { useAppDispatch, useAppSelector } from "bll/store";
import { user_idSelector } from "bll/selectors";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { InputTypeFileInModal } from "../../UI/common/inputTypeFileCover/inputTypeFileInModal";

type PropsType = {
  name: string;
  id: string;
  userId: string;
};

export const EditPackModal = (props: PropsType) => {
  const dispatch = useAppDispatch();
  const meID = useAppSelector(user_idSelector);
  const PackId = props.id;
  const UserId = props.userId;

  const Title = "Edit pack";

  // для инпута
  const [namePack, setNamePack] = React.useState<string>("");

  const [cover, setCover] = useState<string>("");
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNamePack(e.target.value);
  };

  useEffect(() => {
    setNamePack(props.name);
  }, []);

  const renamePack = (PackId: string, namePack: string, UserId: string, cover: string) => {
    UserId === meID
      ? dispatch(renameCardPackTC(PackId, namePack, cover, UserId))
      : dispatch(renameCardPackTC(PackId, namePack, cover));
    setOpen(false);
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <button onClick={handleOpen} className={s.button_style}>
        <BorderColorIcon className={s.icon_style} />
      </button>

      <BasicModal open={open} handleClose={handleClose}>
        <div className={s.firstBlock}>
          <span>{Title}</span>
        </div>
        <div>
          <div className={s.coverContainer}>
            <div className={s.coverMenu}>
              <div>Cover</div>
            </div>
            <div className={s.cover}>
              <div className={s.cover}>
                <InputTypeFileInModal cover={cover} setCover={setCover} />
              </div>
            </div>
          </div>
        </div>
        <div>
          <TextField
            id="standard-basic"
            label="Name pack"
            variant="standard"
            sx={{ width: "347px" }}
            onChange={handleChangeInput}
            value={namePack}
            autoFocus={true}
          />
        </div>
        <div className={s.saveBlock}>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={() => renamePack(PackId, namePack, UserId, cover)}>
            Save
          </Button>
        </div>
      </BasicModal>
    </>
  );
};
