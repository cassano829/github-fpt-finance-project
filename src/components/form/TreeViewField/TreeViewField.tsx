/* eslint-disable eqeqeq */
import { Folder } from '@mui/icons-material';
import { TreeView } from '@mui/lab';
import { Checkbox, FormControlLabel, Radio, Box, Typography } from '@mui/material';
import { union } from 'lodash';
import { MinusSquare, PlusSquare, CloseSquare, StyledTreeItem } from './TreeViewField.style';
import { useEffect, useState } from 'react';

type Props = {
  multiple?: boolean;
  data?: RenderTree[];
  value?: any[] | any;
  onChange?: (updatedValue: any[] | any) => any;
  onDisabled?: (id: string) => boolean;
};

export default function TreeViewField({ data = [], value, onChange, multiple, onDisabled }: Props) {
  const [selected, setSelected] = useState<any[] | any>(() => {
    if (value) return value;
    return multiple ? [] : null;
  });
  const [expanded, setExpanded] = useState<string[]>([]);

  const controlledValue = value ?? selected;

  const onChangeValue = (updateValue: any) => {
    if (onChange) {
      onChange(updateValue);
    } else {
      setSelected(updateValue);
    }
  };

  const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setExpanded(nodeIds);
  };

  useEffect(() => {
    let array: string[] = [];

    for (let index = 0; index < data?.length; index++) {
      const node = data[index];
      const childs = getChildById(node, node.id);
      const childHasSelected = multiple
        ? union(controlledValue, childs).length !== 0
        : childs.some((v) => v === controlledValue);
      if (childHasSelected) {
        array.push(node.id);
      }
    }
    setExpanded((prev) => union(prev, array));
  }, [controlledValue, data, multiple]);

  function getChildById(node: RenderTree, id: string) {
    let array: string[] = [];

    function getAllChild(nodes: RenderTree | null) {
      if (nodes === null) return [];
      array.push(nodes.id);
      if (Array.isArray(nodes.children)) {
        nodes.children.forEach((node) => {
          array = [...array, ...getAllChild(node)];
          array = array.filter((v, i) => array.indexOf(v) === i);
        });
      }
      return array;
    }

    function getNodeById(nodes: RenderTree, id: string) {
      if (nodes.id === id) {
        return nodes;
      } else if (Array.isArray(nodes.children)) {
        let result = null;
        nodes.children.forEach((node) => {
          if (!!getNodeById(node, id)) {
            result = getNodeById(node, id);
          }
        });
        return result;
      }

      return null;
    }

    return getAllChild(getNodeById(node, id));
  }

  function getOnChange(checked: boolean, nodes: RenderTree) {
    if (!multiple) {
      onChangeValue(checked ? nodes.id : null);
      return;
    }

    let array = checked
      ? [...controlledValue, nodes.id]
      : controlledValue.filter((value: any) => value !== nodes.id);

    onChangeValue(array);
  }

  const renderTree = (nodes: RenderTree) => {
    const checked = multiple
      ? controlledValue.some((item: any) => `${item}` == nodes.id)
      : nodes.id == `${controlledValue}`;
    const Control = multiple ? Checkbox : Radio;

    const childs = getChildById(nodes, nodes.id);
    const childHasSelected = multiple
      ? union(controlledValue, childs).length !== 0
      : childs.some((v) => v === controlledValue);

    const disabled = onDisabled && onDisabled(nodes.id);
    const isContainer = Boolean(nodes.children?.length);
    // console.log(`nodes.id, disabled`, nodes.id, disabled);
    return (
      <StyledTreeItem
        key={`${nodes.id}`}
        defaultChecked={childHasSelected}
        nodeId={`${nodes.id}`}
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
            {isContainer && <Folder sx={{ color: 'primary.main', pr: 1 }} />}
            {disabled ? (
              <>
                <Typography>{nodes.name}</Typography>
              </>
            ) : (
              <FormControlLabel
                disabled={disabled}
                control={
                  <Control
                    defaultChecked={checked}
                    checked={checked}
                    onChange={(event) => getOnChange(event.currentTarget.checked, nodes)}
                    // onClick={(e) => e.stopPropagation()}
                  />
                }
                label={<>{nodes.name}</>}
              />
            )}
          </Box>
        }
      >
        {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
      </StyledTreeItem>
    );
  };

  return (
    <TreeView
      expanded={expanded}
      defaultCollapseIcon={<MinusSquare />}
      defaultExpandIcon={<PlusSquare />}
      defaultEndIcon={<CloseSquare />}
      onNodeToggle={handleToggle}
      sx={{ maxHeight: 300, flexGrow: 1, overflowY: 'auto' }}
    >
      {data.map((d) => renderTree(d))}
    </TreeView>
  );
}

export type RenderTree = {
  id: string;
  name: string;
  children?: RenderTree[];
};
