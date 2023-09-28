using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public interface IBaseAiState
{
    public void StateEnter();
    public void StateUpdate();
    public void StateExit();
}
