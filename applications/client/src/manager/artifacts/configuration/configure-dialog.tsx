import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Tab, Tabs } from "@mui/material";
import { clone } from "lodash";
import { FC, useContext, useEffect, useState } from "react";
import { DefaultConfigurationContext } from "../../../application";
import { ClientConfiguration, ClientConfigurator } from "../../../configuration";
import { Modeling } from "./tabs/modeling";

/**
 * Dialog that edits configuration.
 */
export const ConfigureDialog: FC<{
  isOpen: boolean,
  close: () => void,
  onChange: (configuration: object) => void,
  configuration: object,
}> = ({isOpen, close, onChange, configuration}) => {
  const defaultConfiguration = useContext(DefaultConfigurationContext);
  const [localConfiguration, setLocalConfiguration] = useState(() => clone(configuration));
  useEffect(() => {
    if (isOpen) {
      setLocalConfiguration(clone(configuration))
    }
  }, [isOpen, configuration]);

  const [currentTab, setCurrentTab] = useState(0);

  return <Dialog
    open={isOpen}
    onClose={close}
    maxWidth="sm"
    fullWidth
  >
    <DialogTitle>
      Configure
    </DialogTitle>
    <DialogContent>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={(e, i) => setCurrentTab(i)}>
          <Tab label="Modeling" />
        </Tabs>
      </Box>
      {currentTab === 0 &&
        <Modeling
            input={ClientConfigurator.getFromObject(localConfiguration)}
            onChange={u => setLocalConfiguration(ClientConfigurator.setToObject(localConfiguration, u))}
            defaultObject={ClientConfigurator.getFromObject(defaultConfiguration) as ClientConfiguration}
        />
      }

    </DialogContent>
    <DialogActions>
      <Button onClick={close}>Discard</Button>
      <Button onClick={() => {
        onChange(localConfiguration);
        close();
      }}>Save</Button>
    </DialogActions>
  </Dialog>;
}
